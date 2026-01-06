import React, { useState, useRef, useEffect } from 'react';
import { AppMode, Message, MessageRole, PersonaProfile, DEFAULT_PERSONA, Attachment, Session, SwotData, RadarData, AssessmentData, ChartPayload } from './types';
import { generateExpertAnalysis, simulatePersonaInteraction } from './services/geminiService';
import { IconBot, IconUser, IconSend, IconPaperclip, IconBrain, IconUsers, IconTrash, IconCopy, IconDownload, IconHistory, IconPlus, IconCheck, IconPlay, IconHelp, IconClipboard, IconBook } from './components/Icons';
import { PersonaConfigurator } from './components/PersonaConfigurator';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { ChartRenderer } from './components/VisualModels';
import { ProductIntakeForm } from './components/ProductIntakeForm';
import { HEFMGuideModal } from './components/HEFMGuideModal';

// Helper to auto-scroll chat
const ScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  useEffect(() => elementRef.current?.scrollIntoView({ behavior: 'smooth' }));
  return <div ref={elementRef} />;
};

// Copy Button Component
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Clean placeholder from text before copying
    const cleanText = text.replace('[[CHART_PLACEHOLDER]]', '');
    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="复制内容">
      {copied ? <IconCheck className="w-3 h-3 text-emerald-500" /> : <IconCopy className="w-3 h-3" />}
    </button>
  );
};

// --- Model Capabilities Data ---
const MODEL_CAPABILITIES = [
  {
    title: "HEFM-Pro 7维决策模型",
    desc: "专为硬件出海定制的量化评估体系。包含以下核心维度：",
    subitems: [
        "1. 市场需求 (Market Demand)",
        "2. 资金利用率 (Capital Efficiency)",
        "3. 供应链优势 (Supply Chain)",
        "4. 合规与风控 (Compliance)",
        "5. 竞争格局 (Competition)",
        "6. 流量获客 (Marketing)",
        "7. 产品差异化 (Differentiation)"
    ]
  },
  {
    title: "风险雷达 & 规避建议",
    desc: "针对 Amazon/DTC 场景的智能预警系统。自动扫描 IP 侵权、认证缺失、平台封号等致命风险，并基于风险概率(Prob)和严重程度(Imp)给出具体的规避策略。"
  },
  {
    title: "智能尽职调查 (Audit)",
    desc: "Data Integrity Check。自动识别关键决策信息缺失（如BOM成本、物流方式、推广预算），标记为 Missing Fields，防止基于不完整信息做出盲目决策。"
  },
  {
    title: "资金 & 流量压力测试",
    desc: "基于您的启动预算进行 Burn Rate 测算。评估资金是否足以支撑首批备货、头程物流及前 3 个月的营销推广费用，预防资金链断裂。"
  },
  {
    title: "SWOT 战略态势推演",
    desc: "结构化定性分析。识别产品的内部优势/劣势与外部市场机会/威胁，辅助制定差异化的市场切入战略。"
  }
];

// --- Demo Scenarios ---
const DEMO_SCENARIOS = [
  {
    id: 'pet',
    label: '🐶 智能宠物喂食器 (US)',
    title: '示例: 智能宠物喂食器',
    prompt: `**【模拟输入示例】**

**产品**: 智能全自动宠物喂食器 (Smart Pet Feeder with Camera)
**目标市场**: 美国 (Amazon FBA & 独立站)
**目标售价**: $89.99
**成本结构**:
- BOM成本: $28.00
- 头程物流: $3.50/台
- 亚马逊配送费: $7.20
**预算**:
- 首批备货: $15,000 (500台)
- 推广预算: $5,000 (首月)
**核心卖点**:
- 1080P 夜视摄像头，支持双向语音。
- AI 动作捕捉，自动生成“宠物Vlog”推送到手机。
- 抗菌陶瓷食盆（差异化点，竞品多为不锈钢）。
**当前痛点/疑问**:
- 竞品（如 Petlibro）售价在 $60-$80，我定 $90 是否太高？
- 只有 $20k 启动资金，是否太冒险？
- 摄像头是否涉及复杂的隐私合规问题？`
  },
  {
    id: 'ebike',
    label: '🚲 E-Bike 改装套件 (DE)',
    title: '示例: E-Bike 改装套件',
    prompt: `**【模拟输入示例】**

**产品**: 250W 中置电机 E-Bike 改装套件 (Mid-drive Motor Kit)
**目标市场**: 德国 (DTC 独立站 + 线下维修店合作)
**目标售价**: €450
**成本结构**:
- BOM成本: €180 (含电机、控制器、传感器)
- 认证摊销: €5/台 (CE, EN15194)
- 德国本地仓储配送: €25
**预算**:
- 首批备货: €50,000
- 售后备件池: €5,000
**核心卖点**:
- 傻瓜式安装：普通人 15 分钟即可将旧自行车改为电助力。
- 扭矩传感器：骑行阻力极低，体验接近原厂电助力车。
- 兼容性：适配 95% 的标准五通车架。
**当前痛点/疑问**:
- 德国 TUV 认证周期长、费用高，初期能否“无证裸奔”？
- 只有英语说明书，德国人是不是很介意？
- 博世 (Bosch) 在当地极其强势，如何切入细分市场？`
  },
  {
    id: 'coffee',
    label: '☕ 便携意式咖啡机 (JP)',
    title: '示例: 便携意式咖啡机',
    prompt: `**【模拟输入示例】**

**产品**: 手压式便携意式咖啡机 (Portable Manual Espresso Maker)
**目标市场**: 日本 (Makuake 众筹 -> 乐天/Amazon JP)
**目标售价**: 8,500 JPY (约 $55)
**成本结构**:
- BOM成本: $12
- 礼品级包装: $3
- 日本当地物流: $6
**预算**:
- 众筹视频拍摄: $5,000
- KOL/YouTuber 推广: $3,000
**核心卖点**:
- 极致轻便：仅重 300g，专为 Solo Camping (单人露营) 设计。
- 专利双阀门：无需电力也能压出丰富油脂 (Crema)。
- 治愈系配色：森系绿/沙色，符合日系审美。
**当前痛点/疑问**:
- 日本露营市场是不是已经饱和卷不动了？
- 清洗是否方便？日本人据说有洁癖。
- Makuake 众筹需要日本当地法人或代理商，如何解决信任问题？`
  }
];

export default function App() {
  // State
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  // Current Session State
  const [mode, setMode] = useState<AppMode>(AppMode.ExpertAnalysis);
  const [messages, setMessages] = useState<Message[]>([]);
  const [persona, setPersona] = useState<PersonaProfile>(DEFAULT_PERSONA);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Sessions from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gl_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
        // Load the most recent session or create new if empty
        if (parsed.length > 0) {
            loadSession(parsed[0]);
        } else {
            createNewSession();
        }
      } catch (e) {
        console.error("Failed to load sessions", e);
        createNewSession();
      }
    } else {
        createNewSession();
    }
  }, []);

  // Save Sessions to LocalStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
        localStorage.setItem('gl_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Sync current state to the active session object in the sessions array
  useEffect(() => {
    if (!currentSessionId) return;
    
    setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
            return {
                ...s,
                messages,
                mode,
                persona,
                lastModified: Date.now(),
                // Update title based on first user message if title is default
                title: s.title === '新对话' && messages.length > 1 
                    ? (messages.find(m => m.role === MessageRole.User)?.text.slice(0, 20) || '新对话') 
                    : s.title
            };
        }
        return s;
    }).sort((a, b) => b.lastModified - a.lastModified)); // Keep recent on top
  }, [messages, mode, persona]);

  const createNewSession = () => {
    const newSession: Session = {
        id: Date.now().toString(),
        title: '新对话',
        messages: [{
            id: 'init-1',
            role: MessageRole.Model,
            text: "你好。我是您的**首席跨境投资顾问**。\n\n除了您提到的**资金**和**市场**，作为专家，我还必须考量**“流量成本”**和**“产品壁垒”**。为了建立完整的 **7维 HEFM-Pro 评估模型**，请告诉我：\n\n1. **卖什么？** (有独特卖点吗？还是纯公模？)\n2. **卖去哪？** (默认为美国)\n3. **多少钱？** (启动预算决定了能玩多大的盘子)\n4. **怎么卖？** (依靠 Amazon 搜索流量，还是 TikTok 视频带货？这决定了获客成本)\n\n👉 建议点击下方 **“📝 填写申报单”**，以获得最精准的评估报告。",
            timestamp: Date.now()
        }],
        lastModified: Date.now(),
        mode: AppMode.ExpertAnalysis,
        persona: DEFAULT_PERSONA
    };
    
    setSessions(prev => [newSession, ...prev]);
    loadSession(newSession);
  };

  const loadSession = (session: Session) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setMode(session.mode);
    setPersona(session.persona);
    setAttachments([]);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    localStorage.setItem('gl_sessions', JSON.stringify(newSessions));
    
    if (currentSessionId === id) {
        if (newSessions.length > 0) {
            loadSession(newSessions[0]);
        } else {
            createNewSession();
        }
    }
  };

  const handleLoadExample = async (scenario: typeof DEMO_SCENARIOS[0]) => {
    if (isLoading) return;
    
    const demoId = Date.now().toString();
    const initMsg: Message = {
        id: `demo-init-${demoId}`,
        role: MessageRole.Model,
        text: `👋 欢迎进入 **模拟演示模式**。\n\n下方已自动加载一份关于 **“${scenario.title.replace('示例: ', '')}”** 的调研数据。我将模仿专家视角，为您演示如何进行：\n1. **资金链压力测试**\n2. **合规风险排查**\n3. **HEFM-Pro 7维打分**`,
        timestamp: Date.now()
    };
    const demoUserMsg: Message = {
        id: `demo-user-${demoId}`,
        role: MessageRole.User,
        text: scenario.prompt,
        timestamp: Date.now() + 100
    };

    const newSession: Session = {
        id: demoId,
        title: `💡 ${scenario.title}`,
        messages: [initMsg, demoUserMsg],
        lastModified: Date.now(),
        mode: AppMode.ExpertAnalysis,
        persona: DEFAULT_PERSONA
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(demoId);
    setMode(AppMode.ExpertAnalysis);
    setPersona(DEFAULT_PERSONA);
    setAttachments([]);
    setMessages([initMsg, demoUserMsg]); 

    setIsLoading(true);

    try {
        const response = await generateExpertAnalysis([initMsg], demoUserMsg.text, []);
        
        const botMsg: Message = {
            id: `demo-bot-${Date.now()}`,
            role: MessageRole.Model,
            text: response.text,
            chart: response.chart,
            timestamp: Date.now() + 2000
        };
        
        setMessages(prev => [...prev, botMsg]);
    } catch (e) {
        console.error(e);
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: MessageRole.Model,
            text: "演示生成失败，请检查网络或 API Key。",
            timestamp: Date.now()
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  // --- HTML Export Logic ---
  const generateChartHtml = (chart: ChartPayload) => {
    if (chart.type === 'swot') {
        const data = chart.data as SwotData;
        const renderSection = (title: string, items: string[], bg: string, text: string) => `
            <div style="background-color: ${bg}; padding: 15px; border-radius: 8px; border: 1px solid ${bg.replace('50', '200')}; height: 100%;">
                <h4 style="color: ${text}; margin: 0 0 10px 0; font-size: 14px; font-weight: bold; text-transform: uppercase;">${title}</h4>
                <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 13px; line-height: 1.5;">
                    ${(items || []).map(i => `<li style="margin-bottom: 4px;">${i}</li>`).join('')}
                </ul>
            </div>
        `;
        
        return `
            <div style="margin: 20px 0; font-family: sans-serif;">
                <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px;">SWOT 战略态势</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    ${renderSection('优势 (Strengths)', data.strengths, '#ecfdf5', '#065f46')}
                    ${renderSection('劣势 (Weaknesses)', data.weaknesses, '#fff1f2', '#9f1239')}
                    ${renderSection('机会 (Opportunities)', data.opportunities, '#eff6ff', '#1e40af')}
                    ${renderSection('威胁 (Threats)', data.threats, '#fffbeb', '#92400e')}
                </div>
            </div>
        `;
    }
    
    if (chart.type === 'assessment') {
        const data = chart.data as AssessmentData;
        const decisionColor = data.decision.result === 'GO' ? '#059669' : data.decision.result === 'NO-GO' ? '#e11d48' : '#d97706';
        
        const tableRows = data.scoringTable.map(item => `
            <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px;">
                    <div style="font-weight: 500;">${item.category}</div>
                    <div style="font-size: 10px; color: #94a3b8;">Weight ${(item.weight * 100).toFixed(0)}%</div>
                </td>
                <td style="padding: 10px; text-align: center;">
                    <span style="background: ${item.score >= 8 ? '#d1fae5' : '#fee2e2'}; color: ${item.score >= 8 ? '#047857' : '#b91c1c'}; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                        ${item.score}/10
                    </span>
                </td>
                <td style="padding: 10px; font-size: 12px; color: #475569;">${item.rationale}</td>
            </tr>
        `).join('');

        return `
            <div style="margin: 20px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: white;">
                <div style="padding: 15px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="margin: 0; font-size: 16px;">HEFM 投资评估表</h3>
                        <div style="font-size: 12px; color: #64748b;">资料完整度: ${data.completeness.score}%</div>
                    </div>
                    <div style="padding: 4px 10px; border-radius: 20px; color: white; background: ${decisionColor}; font-weight: bold; font-size: 12px;">
                        ${data.decision.result}
                    </div>
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead style="background: #f1f5f9; font-size: 12px; color: #64748b; text-transform: uppercase;">
                        <tr>
                            <th style="padding: 8px; text-align: left;">维度</th>
                            <th style="padding: 8px; text-align: center;">得分</th>
                            <th style="padding: 8px; text-align: left;">理由</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                 <div style="padding: 15px; background: #f8fafc; font-size: 12px; color: #475569; border-top: 1px solid #e2e8f0;">
                    <b>💡 最终建议:</b> ${data.decision.summary}
                </div>
            </div>
        `;
    }

    if (chart.type === 'radar') {
        const data = chart.data as RadarData;
        const size = 300;
        const center = size / 2;
        const radius = 90; // slightly smaller for safety
        const dimensions = data.dimensions || [];
        const count = dimensions.length;
        
        const getPoint = (val: number, idx: number) => {
            const angle = (Math.PI * 2 * idx) / count - Math.PI / 2;
            const r = (val / 100) * radius;
            return {
                x: center + r * Math.cos(angle),
                y: center + r * Math.sin(angle)
            };
        };

        const polyPoints = dimensions.map((d, i) => {
            const p = getPoint(d.value, i);
            return `${p.x},${p.y}`;
        }).join(' ');

        const bgPoly = dimensions.map((_, i) => {
            const p = getPoint(100, i);
            return `${p.x},${p.y}`;
        }).join(' ');

        // Simple labels manually positioned via text anchors
        const labelsHtml = dimensions.map((d, i) => {
             const p = getPoint(125, i);
             return `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="#64748b" font-family="sans-serif">${d.label}</text>`;
        }).join('');

        const svg = `
            <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="background: white; margin: 0 auto; display: block;">
                <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#e2e8f0" stroke-dasharray="4 2"></circle>
                <circle cx="${center}" cy="${center}" r="${radius * 0.6}" fill="none" stroke="#e2e8f0" stroke-dasharray="4 2"></circle>
                <polygon points="${bgPoly}" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"></polygon>
                <polygon points="${polyPoints}" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" stroke-width="2"></polygon>
                ${labelsHtml}
            </svg>
        `;
        
        return `
            <div style="margin: 20px 0; padding: 20px; background: white; border: 1px solid #e2e8f0; border-radius: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; mb-4">
                    <h3 style="margin: 0; color: #1e293b; font-size: 16px;">HEFM-Pro 7维选品雷达</h3>
                    <div style="text-align: right;">
                        <span style="font-size: 12px; color: #64748b; display: block;">综合评分</span>
                        <span style="font-size: 20px; font-weight: bold; color: #2563eb;">${data.overallScore}</span>
                    </div>
                </div>
                ${svg}
                <div style="margin-top: 15px; font-size: 12px; color: #475569;">
                     ${dimensions.map(d => `<div style="display:flex; justify-content:space-between; padding: 4px 0; border-bottom: 1px dashed #f1f5f9;"><span>${d.label}</span><b>${d.value}</b></div>`).join('')}
                </div>
            </div>
        `;
    }
    return '';
  };

  // Switch modes inside current session
  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    const systemMsg: Message = {
      id: Date.now().toString(),
      role: MessageRole.Model,
      text: newMode === AppMode.ExpertAnalysis 
        ? "已切换至**出海选品决策模式**。\n\n让我们重新审视：您的产品在美国市场有真正的机会吗？还是会被供应链成本和激烈的竞争拖垮？请提供最新信息。"
        : `用户仿真模式已激活。\n\n我正在模拟一位来自 **${persona.country}** 的 **${persona.age}** 岁用户。请把您的产品当作已经在 Amazon 或 TikTok 上架展示给我看。`,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, systemMsg]);
    setAttachments([]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const readFile = (file: File): Promise<Attachment> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
           if (typeof reader.result === 'string') {
               let mimeType = file.type;
               const ext = file.name.split('.').pop()?.toLowerCase();
               
               if (!mimeType) {
                   if (ext === 'md') mimeType = 'text/markdown';
                   else if (ext === 'txt') mimeType = 'text/plain';
                   else if (ext === 'csv') mimeType = 'text/csv';
                   else if (ext === 'docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                   else if (ext === 'doc') mimeType = 'application/msword';
                   else if (ext === 'pptx') mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
                   else if (ext === 'ppt') mimeType = 'application/vnd.ms-powerpoint';
               } else if (ext === 'md' && mimeType === 'text/plain') {
                   mimeType = 'text/markdown';
               }

               resolve({
                   name: file.name,
                   type: mimeType || 'application/octet-stream',
                   data: reader.result
               });
           } else {
               reject(new Error("File read failed"));
           }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    try {
        const filePromises = Array.from(files).map(async (file: File) => {
            if (file.size > 10 * 1024 * 1024) {
                alert(`文件 ${file.name} 太大 (最大 10MB)`);
                return null;
            }
            return await readFile(file);
        });

        const results = await Promise.all(filePromises);
        const validAttachments = results.filter((r): r is Attachment => r !== null);
        
        setAttachments(prev => [...prev, ...validAttachments]);
    } catch (error) {
        console.error("File upload error", error);
        alert("上传文件时发生错误，请重试。");
    } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: MessageRole.User,
      text: input,
      attachments: [...attachments],
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    try {
      let response;
      if (mode === AppMode.ExpertAnalysis) {
        response = await generateExpertAnalysis(messages, userMessage.text, userMessage.attachments || []);
      } else {
        response = await simulatePersonaInteraction(persona, messages, userMessage.text, userMessage.attachments || []);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.Model,
        text: response.text,
        chart: response.chart, 
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: MessageRole.Model,
        text: "抱歉，处理您的请求时遇到错误。",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIntakeSubmit = (prompt: string) => {
    setInput(prompt);
    setShowIntakeForm(false);
    // Optional: automatically send after filling
    // handleSend(); // Better to let user review first
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExport = () => {
    if (messages.length === 0) return;

    const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${sessions.find(s => s.id === currentSessionId)?.title || 'GlobalLaunch AI Report'}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #334155; }
        .message { margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 24px; }
        .role { font-weight: bold; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; color: #64748b; }
        .content { white-space: pre-wrap; }
        .user { color: #2563eb; }
        .model { color: #7c3aed; }
        h1 { border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 30px; }
    </style>
</head>
<body>
    <h1>GlobalLaunch AI - 评估报告</h1>
    <div style="margin-bottom: 20px; color: #64748b; font-size: 14px;">
        生成时间: ${new Date().toLocaleString()}<br/>
        模式: ${mode === AppMode.ExpertAnalysis ? '专家决策 (Expert Analysis)' : '用户仿真 (Persona Simulation)'}
    </div>
    
    ${messages.map(msg => {
        let contentHtml = msg.text
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br/>');
            
        // Inject charts if present
        if (msg.chart) {
            const chartHtml = generateChartHtml(msg.chart);
            // Try to replace placeholder if exists, otherwise append
            if (contentHtml.includes('[[CHART_PLACEHOLDER]]')) {
                contentHtml = contentHtml.replace('[[CHART_PLACEHOLDER]]', chartHtml);
            } else {
                contentHtml += `<div style="margin-top: 20px;">${chartHtml}</div>`;
            }
        }
        
        return `
            <div class="message">
                <div class="role ${msg.role === MessageRole.User ? 'user' : 'model'}">
                    ${msg.role === MessageRole.User ? 'User' : 'AI Advisor'}
                </div>
                <div class="content">${contentHtml}</div>
            </div>
        `;
    }).join('')}
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GlobalLaunch_Report_${new Date().toISOString().slice(0,10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col hidden md:flex z-10">
        <div className="p-4 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
              <IconBrain className="w-5 h-5" />
            </span>
            GlobalLaunch AI
          </h1>
          <button 
            onClick={createNewSession}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg text-sm hover:bg-slate-800 transition-all shadow-sm"
          >
            <IconPlus className="w-4 h-4" />
            新对话 (New Chat)
          </button>
          
          {/* Demo Scenarios Section */}
          <div className="mt-4">
            <div className="text-[10px] font-semibold text-slate-400 mb-2 px-1 uppercase tracking-wider">加载示例 (Load Demos)</div>
            <div className="space-y-1">
                {DEMO_SCENARIOS.map(s => (
                    <button 
                        key={s.id}
                        onClick={() => handleLoadExample(s)}
                        disabled={isLoading}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-blue-600 rounded-lg border border-slate-100 transition-colors text-left disabled:opacity-50"
                    >
                        <span>{s.label}</span>
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
             <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200 rounded-lg">
                <button
                    onClick={() => handleModeChange(AppMode.ExpertAnalysis)}
                    className={`flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                        mode === AppMode.ExpertAnalysis ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <IconBrain className="w-3 h-3" /> 决策专家
                </button>
                <button
                    onClick={() => handleModeChange(AppMode.PersonaSimulation)}
                    className={`flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                        mode === AppMode.PersonaSimulation ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <IconUsers className="w-3 h-3" /> 用户仿真
                </button>
             </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-2">
            <h3 className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <IconHistory className="w-3 h-3" /> 历史记录
            </h3>
            <div className="space-y-1">
                {sessions.map(session => (
                    <div 
                        key={session.id}
                        onClick={() => loadSession(session)}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all text-sm ${
                            currentSessionId === session.id 
                            ? 'bg-blue-50 text-blue-700 font-medium' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <span className="truncate flex-1 pr-2">{session.title}</span>
                        <button 
                            onClick={(e) => deleteSession(e, session.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                        >
                            <IconTrash className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* Active Context Settings & Capabilities */}
        <div className="border-t border-slate-100 p-4 bg-slate-50 relative">
            {mode === AppMode.PersonaSimulation ? (
                <div className="max-h-[35vh] overflow-y-auto">
                    <PersonaConfigurator profile={persona} onChange={setPersona} />
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="font-semibold text-slate-700 text-xs flex items-center justify-between">
                        <span>当前模型能力:</span>
                        {/* GUIDE TRIGGER BUTTON */}
                        <button 
                            onClick={() => setShowGuide(true)} 
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-blue-50"
                        >
                            <IconBook className="w-3 h-3" />
                            <span className="underline decoration-dotted underline-offset-2">模型详解</span>
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {MODEL_CAPABILITIES.map((cap, i) => (
                            <li key={i} className="group relative">
                                <div className="flex items-start gap-2 cursor-help p-1.5 -mx-1.5 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:bg-blue-600 shrink-0"></div>
                                    <span className="text-xs text-slate-600 group-hover:text-blue-700 font-medium border-b border-dashed border-slate-300 group-hover:border-blue-300 pb-0.5">{cap.title}</span>
                                </div>
                                
                                {/* Tooltip */}
                                <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 absolute bottom-full left-0 mb-2 w-80 p-4 bg-slate-900 text-white text-xs rounded-xl shadow-xl z-[9999] pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                                    <div className="font-bold mb-1.5 text-blue-200 text-sm">{cap.title}</div>
                                    <div className="text-slate-300 leading-relaxed mb-2">{cap.desc}</div>
                                    {/* Render subitems (dimensions) if available */}
                                    {cap.subitems && (
                                        <div className="space-y-1 bg-slate-800/50 p-2 rounded border border-slate-700/50">
                                            {cap.subitems.map((item, idx) => (
                                                <div key={idx} className="text-[10px] text-slate-400 flex gap-1.5">
                                                    <span className="text-blue-400">•</span>
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {/* Arrow */}
                                    <div className="absolute top-full left-6 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
        
        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-200 flex items-center justify-between bg-white">
            <span className="text-[10px] text-slate-400">Gemini 3 Pro</span>
            <button 
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors"
                title="导出当前对话记录"
            >
                <IconDownload className="w-3 h-3" /> 导出报告 (HTML)
            </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header */}
        <div className="md:hidden p-4 bg-white border-b flex justify-between items-center shadow-sm">
            <span className="font-bold text-slate-800 flex items-center gap-2">
                <IconBrain className="w-5 h-5 text-blue-600" /> GL AI
            </span>
            <div className="flex gap-2">
                 <button onClick={handleExport} className="p-2 bg-slate-100 rounded text-slate-600"><IconDownload className="w-4 h-4" /></button>
                 <button onClick={createNewSession} className="p-2 bg-blue-600 text-white rounded"><IconPlus className="w-4 h-4" /></button>
            </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.role === MessageRole.User ? 'flex-row-reverse' : 'flex-row'} max-w-4xl mx-auto group`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === MessageRole.User ? 'bg-white border border-slate-200' : 
                mode === AppMode.ExpertAnalysis ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white' : 'bg-gradient-to-br from-purple-600 to-purple-700 text-white'
              }`}>
                {msg.role === MessageRole.User ? <IconUser className="w-5 h-5 text-slate-400" /> : <IconBot className="w-5 h-5" />}
              </div>

              <div className={`flex flex-col gap-1 max-w-[90%] md:max-w-[80%]`}>
                {/* Role Label */}
                <div className={`flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider ${msg.role === MessageRole.User ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span>{msg.role === MessageRole.User ? 'You' : (mode === AppMode.ExpertAnalysis ? 'Expert AI' : `User: ${persona.occupation}`)}</span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <CopyButton text={msg.text} />
                    </div>
                </div>

                <div className={`p-5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed overflow-hidden ${
                  msg.role === MessageRole.User 
                    ? 'bg-white text-slate-800 border border-slate-200 rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none ring-1 ring-slate-900/5'
                }`}>
                  {/* Attachments Preview */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-slate-100">
                        {msg.attachments.map((att, i) => (
                            <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-xs text-slate-600">
                                <IconPaperclip className="w-3 h-3" />
                                <span className="truncate max-w-[150px]">{att.name}</span>
                            </div>
                        ))}
                    </div>
                  )}
                  
                  {/* Text Content - Renders Chart Inline if placeholder exists */}
                  {(() => {
                    const parts = msg.text.split('[[CHART_PLACEHOLDER]]');
                    return (
                        <>
                            {parts[0] && <MarkdownRenderer content={parts[0]} isUser={msg.role === MessageRole.User} />}
                            {msg.chart && parts.length > 1 && (
                                <div className="my-6">
                                    <ChartRenderer chart={msg.chart} />
                                </div>
                            )}
                            {parts[1] && <MarkdownRenderer content={parts[1]} isUser={msg.role === MessageRole.User} />}
                            {/* Fallback for old messages or if no placeholder found but chart exists */}
                            {msg.chart && parts.length === 1 && (
                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <ChartRenderer chart={msg.chart} />
                                </div>
                            )}
                        </>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-4xl mx-auto">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    mode === AppMode.ExpertAnalysis ? 'bg-blue-600' : 'bg-purple-600'
                } text-white animate-pulse`}>
                    <IconBot className="w-5 h-5" />
                </div>
                <div className="p-4 bg-white rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                </div>
            </div>
          )}
          <ScrollToBottom />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-20">
          <div className="max-w-4xl mx-auto flex flex-col gap-2">
            
            {/* Attachment Preview */}
            {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 mb-1">
                    {attachments.map((att, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded border border-slate-200 text-xs shadow-sm">
                            <span className="truncate max-w-[200px]">{att.name}</span>
                            <button onClick={() => removeAttachment(i)} className="text-slate-400 hover:text-red-500">
                                <IconTrash className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-end gap-2 relative">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    multiple 
                    onChange={handleFileUpload} 
                    accept="image/*,application/pdf,text/plain,.md,.doc,.docx,.ppt,.pptx,.csv"
                />
                
                {/* NEW: Intake Form Button */}
                <button
                    onClick={() => setShowIntakeForm(true)}
                    className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors flex shrink-0"
                    title="填写立项申报单"
                >
                    <IconClipboard className="w-5 h-5" />
                </button>

                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="上传文件"
                >
                    <IconPaperclip className="w-5 h-5" />
                </button>

                <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-inner">
                    <textarea
                        className="w-full bg-transparent border-none focus:ring-0 p-3 max-h-32 min-h-[48px] resize-none text-slate-800 placeholder-slate-400 text-sm"
                        placeholder={mode === AppMode.ExpertAnalysis ? "输入产品想法，或点击左侧 📝 填表申报..." : "输入问题，获取用户真实反馈..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />
                </div>

                <button
                    onClick={handleSend}
                    disabled={(!input.trim() && attachments.length === 0) || isLoading}
                    className={`p-3 rounded-full transition-all shadow-sm flex items-center justify-center ${
                        (!input.trim() && attachments.length === 0) || isLoading
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                >
                    <IconSend className="w-5 h-5" />
                </button>
            </div>
            <div className="text-center text-[10px] text-slate-400 mt-1 flex justify-center gap-4">
               <span>支持: PDF, Word, PPT, 图片, TXT</span>
               <span>•</span>
               <span className="hidden md:inline">推荐使用“立项申报单”获取精准评估</span>
            </div>
          </div>
        </div>

        {/* Modal: Intake Form */}
        {showIntakeForm && (
            <ProductIntakeForm 
                onClose={() => setShowIntakeForm(false)} 
                onSubmit={handleIntakeSubmit} 
            />
        )}
        
        {/* Modal: HEFM Guide */}
        <HEFMGuideModal 
            isOpen={showGuide} 
            onClose={() => setShowGuide(false)} 
        />

      </div>
    </div>
  );
}