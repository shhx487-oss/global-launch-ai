# GlobalLaunch AI - 技术架构与开发参考文档 (v2.5)

> **版本**: 2.5  
> **更新日期**: 2025-05-23  
> **适用范围**: 核心业务逻辑、数据结构规范、Prompt 工程与系统架构。

## 1. 项目概述 (Overview)

GlobalLaunch AI 是一个专为硬件出海企业设计的**智能决策支持系统 (DSS)**。它利用 Google Gemini 3 系列模型，通过“双模态”交互（专家决策模式 + 用户仿真模式），为用户提供从资金审计、市场可行性评估到风险排查的全链路分析。

### 核心价值主张
1.  **Structured Intake (结构化申报)**: **(v2.5 新增)** 通过引导式表单（Product Intake Form）收集决策因子，解决“Garbage In, Garbage Out”问题，确保评估的精准性。
2.  **HEFM-Pro 模型**: 专为跨境硬件定制的 7 维量化评估体系。
3.  **Risk Radar (风险雷达)**: 针对 Amazon/DTC 场景的致命风险（IP侵权、合规、封号）预警系统。
4.  **Strategic Guidance (战略引导)**: 基于“缺失信息”和“低分维度”自动生成的深度思考题。
5.  **Persona Simulation (仿真模拟)**: 基于目标国人口统计学特征的用户反馈模拟。

---

## 2. 核心业务模型 (Core Business Logic)

### 2.1 HEFM-Pro 7维评估模型
这是系统的核心算法（由 Prompt 驱动），用于量化评估项目的可行性。逻辑位于 `services/geminiService.ts` 的 `generateExpertAnalysis` 函数中。

| 维度 | 英文标识 | 权重 | 评估重点 |
| :--- | :--- | :--- | :--- |
| **1. 市场需求** | `Market Demand` | 20% | 目标市场刚需程度、搜索趋势、长青/季节性判断。 |
| **2. 资金利用率** | `Capital Efficiency` | 15% | **(关键)** 预算能否支撑MOQ、首批物流及前3个月推广。 |
| **3. 供应链优势** | `Supply Chain` | 15% | 成本结构、定倍率、产能稳定性。 |
| **4. 合规与风控** | `Compliance & Risk` | 10% | 认证难度 (FCC/UL/FDA)、平台政策限制。 |
| **5. 竞争格局** | `Competition` | 10% | 头部垄断程度、价格战烈度。 |
| **6. 流量获客** | `Marketing Feasibility` | 15% | CPC/CPM 成本、社交传播属性 (Viral Potential)。 |
| **7. 产品差异化** | `Differentiation` | 15% | 专利壁垒、微创新点、护城河深浅。 |

### 2.2 战略引导逻辑 (Strategic Logic)
系统不仅打分，还通过 `Strategic Questions` 模块进行反问。生成逻辑遵循双重触发机制：
1.  **Data Gap Trigger**: 当关键信息（如预算、BOM成本）缺失时，强制追问风险承受力。
2.  **Low Score Trigger**: 当某维度得分 < 6 分时，挑战用户的解决方案（如：面对巨头垄断，你的差异化在哪里？）。

---

## 3. 技术架构 (Technical Architecture)

### 3.1 技术栈
*   **Framework**: React 18 + Vite
*   **Language**: TypeScript
*   **AI SDK**: `@google/genai` (Google Gemini API)
*   **Styling**: Tailwind CSS + Typography Plugin
*   **Storage**: Browser LocalStorage (无后端，纯客户端运行)
*   **Rendering**: React-Markdown (文本) + SVG (图表)

### 3.2 核心数据流 (Data Flow)

1.  **Input**: 
    *   **Text/File**: 用户自然语言输入或文档上传。
    *   **Form**: 结构化表单 (`ProductIntakeForm`) -> 生成 Markdown Prompt。
2.  **Inference**: 
    *   构建 System Prompt (包含 `json_chart` 指令)。
    *   调用 `gemini-3-pro-preview` (Expert) 或 `gemini-3-flash-preview` (Simulation)。
3.  **Parsing & Rendering**:
    *   正则表达式提取 ` ```json_chart ... ``` ` 块。
    *   文本部分 -> Markdown 渲染 (`MarkdownRenderer`)。
    *   JSON 部分 -> 解析为 `ChartPayload` -> 渲染为交互式组件。
4.  **Persistence**: 状态同步至 `localStorage['gl_sessions']`。

### 3.3 目录结构与核心组件
```
src/
├── components/
│   ├── Icons.tsx           # SVG 图标库
│   ├── MarkdownRenderer.tsx# 文本渲染器
│   ├── PersonaConfigurator.tsx # 用户画像配置
│   ├── ProductIntakeForm.tsx   # [New] 产品立项申报表单
│   └── VisualModels.tsx    # [Core] 可视化模型集合
│       ├── AssessmentCard  # 包含完整度条、评分表、战略问题面板
│       ├── StrategyPanel   # 战略引导提问组件
│       ├── RiskPanel       # 风险雷达组件
│       ├── SwotMatrix      # SWOT 矩阵组件
│       └── RadarChart      # SVG 雷达图
├── services/
│   └── geminiService.ts    # Gemini API 调用封装 & Prompt 管理
├── types.ts                # TypeScript 类型定义 (Source of Truth)
├── App.tsx                 # 主应用逻辑 & 状态管理
```

---

## 4. 数据结构规范 (Type Definitions)

详细定义请参考 `types.ts`。以下是核心交互接口：

### 4.1 评估数据结构 (`AssessmentData`)
这是 Gemini 返回的 JSON 结构，用于渲染 `AssessmentCard`。

```typescript
export interface AssessmentData {
  // 1. 尽职调查：检查信息是否完整
  completeness: {
    score: number; // 0-100
    status: 'Critical Missing' | 'Partial' | 'Sufficient';
    missingFields: string[]; 
    acquiredFields?: string[]; // 已识别字段
  };
  
  // 2. 决策结论
  decision: {
    result: 'GO' | 'NO-GO' | 'CONDITIONAL';
    confidence: number; // 0-100%
    summary: string;    // 一句话总结
  };
  
  // 3. 风险雷达
  risks?: RiskItem[];
  
  // 4. 7维评分表
  scoringTable: {
    category: string; // 对应 HEFM-Pro 7个维度
    score: number;    // 0-10
    rationale: string;// 评分理由
    impact: 'High' | 'Medium' | 'Low';
  }[];

  // 5. 战略引导 (New)
  strategicQuestions?: string[]; // 引导用户深入思考的问题
}
```

---

## 5. Prompt 工程策略 (Prompt Engineering)

核心逻辑位于 `services/geminiService.ts`。

### 5.1 专家模式 (Expert Persona)
*   **Model**: `gemini-3-pro-preview`
*   **Thinking Budget**: `2048` (启用思维链)
*   **Pipeline**:
    1.  **Data Integrity Audit**: 强制区分 Acquired/Missing 信息，若关键信息缺失，完整度分数封顶 60。
    2.  **Qualitative SWOT**: 强制输出标准 Markdown 格式的 SWOT 分析列表。
    3.  **HEFM-Pro Scoring**: 结合预算与市场进行 7 维打分，理由必须基于证据(Evidence-based)。
    4.  **Strategic Guidance**: 
        - 针对 **Missing Info** 生成追问。
        - 针对 **Low Scores (<6)** 生成挑战性问题。
    5.  **Risk Radar**: 风险排查（含概率 Probability）。
    6.  **Decision**: 综合判定。
*   **Output Guardrail**: 要求输出 Markdown (SWOT) + 独立的 ` ```json_chart ``` ` 代码块 (Assessment/Risk)。

### 5.2 仿真模式 (Simulation Persona)
*   **Model**: `gemini-3-flash-preview`
*   **Temperature**: `1.2` (高创造性)
*   **Context Injection**: 
    - 前端自动提取上一轮专家评估的 `decision.result`、`risks` 和 `low scores`。
    - 将这些信息注入到仿真模型的 System Prompt 中，指示用户角色“验证或反驳”专家的观点（例如：专家嫌贵，用户觉得值吗？）。

---

## 6. 开发路线图 (Roadmap)

### Phase 1: 核心功能 (已完成)
- [x] HEFM-Pro 7维模型集成
- [x] 结构化立项申报表单 (Structured Intake)
- [x] 风险雷达 (Risk Radar) (含概率评估)
- [x] SWOT 定性分析 (Markdown 优化)
- [x] 战略引导提问 (Strategic Questions)
- [x] 专家-仿真双模态上下文联动
- [x] 结构化 JSON 输出与图表渲染

### Phase 2: 增强分析 (Next Steps)
- [ ] **竞品对比分析 (Competitor Battle)**: 允许上传竞品 URL，进行横向参数对比。
- [ ] **ROI 计算器**: 利用 Gemini Function Calling，自动估算毛利与盈亏平衡点。
- [ ] **多模态流式响应**: 优化 UX，支持打字机效果的流式输出。

---

## 7. 注意事项

1.  **API Key 安全**: 当前为纯前端演示，API Key 通过 `process.env.API_KEY` 注入。
2.  **JSON 容错**: 前端 `JSON.parse` 包含在 `try-catch` 中，解析失败会降级显示纯文本，并保留 Markdown 部分。