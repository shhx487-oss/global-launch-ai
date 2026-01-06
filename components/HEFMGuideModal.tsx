import React from 'react';
import { IconBrain, IconTarget, IconDollar, IconRocket, IconShield } from './Icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HEFMGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200">
        
        {/* Header */}
        <div className="px-8 py-6 bg-slate-900 text-white flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <span className="p-2 bg-blue-600 rounded-lg"><IconBrain className="w-6 h-6" /></span>
                <h2 className="text-2xl font-bold tracking-tight">HEFM-Pro 决策模型白皮书</h2>
            </div>
            <p className="text-slate-400 text-sm">Hardware Export Feasibility Model - Professional Edition</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full w-10 h-10 flex items-center justify-center transition-colors text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <div className="max-w-3xl mx-auto space-y-12">
            
            {/* Introduction */}
            <section>
                <h3 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">1. 模型概述</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                    <strong>HEFM-Pro (Hardware Export Feasibility Model)</strong> 是 GlobalLaunch AI 核心构建的量化评估体系。它专为 **跨境硬件电商**（Amazon FBA, DTC 独立站, TikTok Shop）场景设计，旨在通过 AI 模拟首席投资官的视角，拒绝“拍脑袋”式决策，从商业本质出发评估项目的可行性。
                </p>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-800">
                    💡 <strong>核心理念：</strong> 产品好不好看是其次，这门生意能不能在激烈的跨境竞争中存活并盈利，才是评估的唯一标准。
                </div>
            </section>

            {/* 7 Dimensions */}
            <section>
                <h3 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-200">2. 七维评估体系详解</h3>
                <div className="grid gap-6">
                    
                    {/* Dimension 1 */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
                                市场需求 (Market Demand)
                            </h4>
                            <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded">权重 20%</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                            评估该品类是“刚需”还是“伪需求”。AI 会结合搜索趋势、市场容量天花板和季节性波动进行判断。
                        </p>
                        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded">
                            <strong>🤔 AI 思考逻辑：</strong> "虽然这个产品设计很独特，但 Google Trends 显示该关键词搜索量极低，且只在圣诞节有波动，属于高风险的季节性窄众品类。"
                        </div>
                    </div>

                    {/* Dimension 2 */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 ring-1 ring-emerald-500/20">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-emerald-800 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">2</span>
                                资金利用率 (Capital Efficiency) <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded ml-2">核心</span>
                            </h4>
                            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded">权重 15%</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                            硬件出海最大的死因是资金链断裂。AI 会计算你的<strong>启动预算</strong>是否足以覆盖：首批备货(MOQ) + 头程物流 + 前3个月营销推广费用。
                        </p>
                        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded">
                            <strong>🤔 AI 思考逻辑：</strong> "你的预算只有 $5,000，但该品类 Amazon PPC 点击成本高达 $3.5，且 MOQ 为 500 件。资金仅够备货，无钱推广，死亡率极高。"
                        </div>
                    </div>

                    {/* Dimension 3 */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">3</span>
                                供应链优势 (Supply Chain)
                            </h4>
                            <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded">权重 15%</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                            评估 BOM 成本结构、定倍率（售价/成本）、产能稳定性以及是公模还是私模。
                        </p>
                    </div>

                    {/* Dimension 4 */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">4</span>
                                合规与风控 (Compliance & Risk)
                            </h4>
                            <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded">权重 10%</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                            包括认证难度（FCC/CE/UL/FDA）、专利侵权风险（外观/发明专利）以及平台政策限制。
                        </p>
                    </div>

                     {/* Dimension 5 */}
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">5</span>
                                竞争格局 (Competition)
                            </h4>
                            <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded">权重 10%</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                            分析头部品牌垄断程度（Top 10 市场占有率）和价格战烈度。如果是“红海”市场，除非资金雄厚或差异化极大，否则得分极低。
                        </p>
                    </div>

                    {/* Dimension 6 */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">6</span>
                                流量获客 (Marketing Feasibility)
                            </h4>
                            <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded">权重 15%</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                            预估获客成本 (CAC)、CPC/CPM 广告费用，以及产品是否具备天然的社交媒体传播属性 (Viral Potential)。
                        </p>
                    </div>

                    {/* Dimension 7 */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">7</span>
                                产品差异化 (Differentiation)
                            </h4>
                            <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded">权重 15%</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                            评估 USP (Unique Selling Proposition)、护城河深浅。仅仅“便宜”不算差异化，“微创新”或“解决痛点”才是关键。
                        </p>
                    </div>
                </div>
            </section>

            {/* Scoring & Decision */}
            <section className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">3. 评分标准 (0-10)</h3>
                    <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex gap-3">
                            <span className="font-bold text-emerald-600 w-12 shrink-0">8 - 10分</span>
                            <span>优势明显。具备极强的竞争力或极高的投资回报率。</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold text-amber-500 w-12 shrink-0">5 - 7分</span>
                            <span>表现平庸。存在明显短板，需要针对性优化方案。</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold text-rose-500 w-12 shrink-0">0 - 4分</span>
                            <span>致命缺陷。由于资金不足、竞争过大或合规风险，建议放弃。</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">4. 决策输出</h3>
                    <div className="space-y-3">
                         <div className="flex items-center gap-3">
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded w-24 text-center">GO</span>
                            <span className="text-sm text-slate-600">推荐立项。成功概率较高，风险可控。</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded w-24 text-center">CONDITIONAL</span>
                            <span className="text-sm text-slate-600">有条件通过。需补充关键缺失信息或解决特定短板。</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded w-24 text-center">NO-GO</span>
                            <span className="text-sm text-slate-600">驳回。高风险或低回报，建议及时止损。</span>
                         </div>
                    </div>
                </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
            >
                关闭 (Close)
            </button>
        </div>
      </div>
    </div>
  );
};