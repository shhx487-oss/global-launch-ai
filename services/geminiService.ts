import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Message, MessageRole, PersonaProfile, Attachment, ChartPayload } from "../types";

// Helper to sanitize base64
const cleanBase64 = (b64: string) => b64.replace(/^data:.+;base64,/, '');

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please set process.env.API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

// Response type wrapper
interface ServiceResponse {
    text: string;
    chart?: ChartPayload;
}

export const generateExpertAnalysis = async (
  history: Message[],
  currentInput: string,
  attachments: Attachment[]
): Promise<ServiceResponse> => {
  const ai = getClient();
  
  const systemInstruction = `
    角色设定：
    你是一位**首席跨境硬件投资顾问**（Chief Cross-border Investment Advisor）。
    你的风格是：**数据驱动、逻辑严密、直言不讳**。你不会为了讨好用户而给出虚高的分数。

    任务目标：
    为用户的硬件出海项目提供**尽职调查 (Due Diligence)** 和 **投资回报评估**。

    ---
    核心决策流程 (Decision Pipeline)：

    第一步：【信息完整性审计 (Data Integrity Audit)】
    **这是建立信任的第一步。** 你必须明确告诉用户你掌握了什么，缺什么。
    - **Acquired**: 已识别的关键信息（如：品类=宠物，预算=$50k，市场=美国）。
    - **Missing**: 缺失的致命变量（如：未提及BOM成本，未提及物流方式）。
    *规则*：如果关键信息（预算、市场、具体产品特征）缺失，completeness score 不得超过 60分。

    第二步：【HEFM-Pro 7维量化评估】
    使用 **HEFM-Pro** 模型打分 (0-10分)。
    **关键逻辑：** 每一个分数必须有**证据支撑 (Evidence-based)**。
    - 不要只说 "市场需求大"。
    - 要说 "虽然Google Trends显示搜索量大，但你的预算($5k)无法支撑 Amazon PPC 首页竞价($3.5/click)，因此资金利用率只能打 3分"。
    
    维度说明：
    1. **市场需求 (Market Demand)**: 刚需程度 vs 伪需求。
    2. **资金利用率 (Capital Efficiency)**: **(核心)** 用户的钱够不够烧？(小预算做红海=找死)。
    3. **供应链优势 (Supply Chain)**: 成本、交期、私模/公模。
    4. **合规与风控 (Compliance)**: 认证(FCC/CE)、专利风险。
    5. **竞争格局 (Competition)**: 巨头垄断程度。
    6. **流量获客 (Marketing)**: 获客成本(CAC)与自然流量潜力。
    7. **产品差异化 (Differentiation)**: 是否具备 USP (Unique Selling Proposition)。

    第三步：【战略引导提问 (Strategic Guidance)】
    **这是体现专家价值的关键。** 请生成 3-5 个深度思考题，帮助用户完善商业计划。
    **生成逻辑：**
    1. **针对缺失信息 (Missing Info)**: 如果第一步中发现关键信息缺失，必须反问。
       - 例如：“你未提及推广预算，请问能否支撑亚马逊 $2-3/点击 的广告费？”
    2. **针对低分项 (Low Scores)**: 如果某维度得分 < 6，必须提出挑战性问题。
       - 例如：“在巨头垄断的品类（得分3分），除了低价，你有什么差异化策略能让用户买单？”

    第四步：【风险雷达 (Risk Radar)】
    识别 IP 侵权、合规、封号等“一票否决”风险。给出发生概率(Probability)和严重程度(Level)。

    第五步：【SWOT 定性分析 (Markdown)】
    先于图表输出，用 Markdown 列表清晰阐述。

    ---
    输出结构要求：
    1. **Text**: 先进行 SWOT 分析，然后总结。
    2. **JSON Chart**: 包含 \`AssessmentData\` 结构。
       - \`strategicQuestions\`: 必须包含 3-5 个引导性问题。
       - \`completeness\`: 必须包含 \`acquiredFields\` 和 \`missingFields\`。

    **JSON Output Example:**
    \`\`\`json_chart
    {
      "type": "assessment",
      "title": "项目评估报告",
      "data": {
        "completeness": {
          "score": 65,
          "status": "Partial", 
          "acquiredFields": ["目标市场(US)", "品类(宠物饮水机)"],
          "missingFields": ["具体BOM成本", "首批备货预算", "营销推广计划"]
        },
        "decision": {
          "result": "CONDITIONAL",
          "confidence": 75,
          "summary": "产品在社媒有传播属性，但缺乏预算数据，无法判断资金链断裂风险。建议在完善成本测算后再做决定。"
        },
        "strategicQuestions": [
            "你未提及首批备货预算，请问在不开模的情况下，你能否承担 $5000 的库存资金占用？",
            "如果竞品发起价格战降至 $19.9，你的供应链能否支撑？",
            "除了亚马逊站内广告，你是否有低成本的站外引流方案？"
        ],
        "risks": [ ... ],
        "scoringTable": [ ... ]
      }
    }
    \`\`\`
  `;

  const contents = [];

  // Add history
  history.forEach(msg => {
    if (msg.role === MessageRole.System) return;
    const parts: any[] = [{ text: msg.text }];
    if (msg.attachments) {
        msg.attachments.forEach(att => {
            parts.push({
                inlineData: {
                    mimeType: att.type,
                    data: cleanBase64(att.data)
                }
            });
        });
    }
    contents.push({
      role: msg.role === MessageRole.User ? 'user' : 'model',
      parts: parts
    });
  });

  // Add current turn
  const currentParts: any[] = [{ text: currentInput }];
  attachments.forEach(att => {
    currentParts.push({
      inlineData: {
        mimeType: att.type,
        data: cleanBase64(att.data)
      }
    });
  });
  
  contents.push({ role: 'user', parts: currentParts });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 2048 },
      }
    });

    const fullText = response.text || "";
    
    // Parse Chart JSON
    let chartPayload: ChartPayload | undefined;
    let cleanText = fullText;

    const jsonMatch = fullText.match(/```json_chart\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
        try {
            const parsed = JSON.parse(jsonMatch[1]);
            if (parsed && typeof parsed === 'object' && parsed.type && parsed.data) {
                chartPayload = parsed;
            }
            cleanText = fullText.replace(jsonMatch[0], '[[CHART_PLACEHOLDER]]').trim();
        } catch (e) {
            console.error("Failed to parse chart JSON", e);
            cleanText = fullText.replace(jsonMatch[0], '').trim();
        }
    }

    return { text: cleanText, chart: chartPayload };
  } catch (error: any) {
    console.error("Gemini Expert Error:", error);
    return { text: `错误: ${error.message || "专家分析服务暂时不可用。"}` };
  }
};

export const simulatePersonaInteraction = async (
  profile: PersonaProfile,
  history: Message[],
  currentInput: string,
  attachments: Attachment[]
): Promise<ServiceResponse> => {
  const ai = getClient();
  
  // Extract summary from last expert message if exists
  const lastExpertMsg = [...history].reverse().find(m => m.role === MessageRole.Model && m.chart?.type === 'assessment');
  let expertContext = "";
  if (lastExpertMsg && lastExpertMsg.chart?.data) {
      const data = lastExpertMsg.chart.data as any; // Cast for simplified access
      expertContext = `
      【前序信息 - 投资专家观点】
      专家对此产品的评价是：${data.decision?.result}。
      专家指出的潜在弱点：${data.scoringTable?.filter((i: any) => i.score < 6).map((i: any) => i.category).join(', ')}。
      专家担心的风险：${data.risks?.map((r: any) => r.type).join(', ')}。
      
      你的任务是：**站在消费者角度验证或反驳专家的观点。** 
      例如，如果专家说“价格太高”，你作为消费者是觉得“确实太贵”还是“为了这个功能我愿意付钱”？
      `;
  }

  const systemInstruction = `
    角色扮演模拟 (Focus Group Simulation)：
    你现在不是AI，你是一个活生生的、居住在 ${profile.country} 的真实消费者。
    
    你的档案：
    - 年龄: ${profile.age}
    - 性别: ${profile.gender}
    - 职业: ${profile.occupation}
    - 兴趣: ${profile.interests}
    - 科技敏感度: ${profile.techSavviness}
    
    上下文：
    ${expertContext}

    你的反应模式：
    1. **First Impression (直觉)**: 看到这个产品的第一反应是什么？(Cool? Cheap? Weird?)
    2. **Deal Breaker (劝退点)**: 什么因素会让你绝对不买？(是说明书看不懂？还是觉得这是义乌小商品？)
    3. **Pricing (心理价位)**: 别管卖家的成本，告诉我你愿意掏多少钱？
    4. **Language**: 请用地道的、符合你人设的语言（甚至包含一点俚语或情绪化表达）。
    
    注意：如果产品信息太少，请直接吐槽：“这只有一张图，我怎么知道是不是垃圾？”
    
    请使用 Markdown 格式。
  `;
  
  const contents = [];
    history.forEach(msg => {
        if (msg.role === MessageRole.System) return;
        contents.push({
        role: msg.role === MessageRole.User ? 'user' : 'model',
        parts: [{ text: msg.text }] 
        });
    });
    const currentParts: any[] = [{ text: currentInput }];
    attachments.forEach(att => {
        currentParts.push({
        inlineData: {
            mimeType: att.type,
            data: cleanBase64(att.data)
        }
        });
    });
    contents.push({ role: 'user', parts: currentParts });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 1.2, // High creativity for persona
      }
    });
    return { text: response.text || "模拟无效。" };
  } catch (error: any) {
    return { text: `错误: ${error.message}` };
  }
};