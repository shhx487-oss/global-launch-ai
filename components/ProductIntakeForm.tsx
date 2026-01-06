import React, { useState } from 'react';
import { IconClipboard, IconCheck, IconRocket, IconDollar, IconTarget, IconBrain } from './Icons';

interface Props {
  onClose: () => void;
  onSubmit: (text: string) => void;
}

const MARKET_PRESETS = ["美国 (Amazon FBA)", "欧洲 (Germany/UK)", "东南亚 (TikTok Shop)", "全球 (DTC 独立站)"];

export const ProductIntakeForm: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    productName: '',
    market: '',
    price: '',
    cost: '',
    budget: '',
    sellingPoints: '',
    concerns: ''
  });

  const handleMarketPreset = (preset: string) => {
    setFormData(prev => ({ ...prev, market: preset }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct structured prompt
    const prompt = `**【标准化立项申报 (Standardized Project Intake)】**

**1. 🎯 产品定义 (Product Definition)**:
- 产品名称/品类: ${formData.productName}
- 目标市场/渠道: ${formData.market}

**2. 💰 财务模型 (Financial Structure)**:
- 目标售价 (RRP): $${formData.price}
- 落地成本 (Landed Cost): $${formData.cost} (含BOM+头程)
- 启动预算 (Budget): $${formData.budget}

**3. 🚀 战略核心 (Strategic Core)**:
- 核心卖点 (USP): ${formData.sellingPoints}
- 决策难点/痛点: ${formData.concerns || '请基于上述参数，进行全维度的 HEFM-Pro 评估，重点关注资金链风险。'}

(此信息由“立项申报单”生成，请严格基于此数据进行量化打分。)`;

    onSubmit(prompt);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 bg-blue-600 rounded-lg text-white"><IconClipboard className="w-4 h-4" /></span>
              新产品立项申报单
            </h2>
            <p className="text-xs text-slate-500 mt-1 pl-8">Standardized Product Intake Form</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors text-xl">&times;</button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
          <form id="intakeForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Basics */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <IconTarget className="w-4 h-4 text-blue-500" /> 1. 基础定义 (Basics)
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">产品名称 / 品类 <span className="text-red-500">*</span></label>
                        <input 
                            required
                            className="w-full text-sm p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                            placeholder="例如：带摄像头的智能宠物喂食器 (Smart Pet Feeder)"
                            value={formData.productName}
                            onChange={e => setFormData({...formData, productName: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">目标市场 & 渠道 <span className="text-red-500">*</span></label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {MARKET_PRESETS.map(preset => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => handleMarketPreset(preset)}
                                    className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                                        formData.market === preset 
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                                    }`}
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>
                        <input 
                            required
                            className="w-full text-sm p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="手动输入，或点击上方快捷选项..."
                            value={formData.market}
                            onChange={e => setFormData({...formData, market: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            {/* Section 2: Financials */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <IconDollar className="w-4 h-4 text-emerald-500" /> 2. 财务模型 (Financials)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">目标售价 (Price)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                            <input 
                                type="number"
                                className="w-full text-sm pl-6 pr-2 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="89.99"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">落地成本 (Cost)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                            <input 
                                type="number"
                                className="w-full text-sm pl-6 pr-2 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="35.00"
                                title="包含BOM+头程运费"
                                value={formData.cost}
                                onChange={e => setFormData({...formData, cost: e.target.value})}
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">*含BOM+头程</p>
                    </div>
                    <div className="col-span-1">
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">启动预算 (Budget) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                            <input 
                                required
                                type="number"
                                className="w-full text-sm pl-6 pr-2 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-emerald-50/30"
                                placeholder="20000"
                                value={formData.budget}
                                onChange={e => setFormData({...formData, budget: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Strategy */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <IconRocket className="w-4 h-4 text-indigo-500" /> 3. 战略核心 (Strategy)
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">核心卖点 (Unique Selling Point) <span className="text-red-500">*</span></label>
                        <textarea 
                            required
                            className="w-full text-sm p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none placeholder:text-slate-400"
                            placeholder="相比竞品，你的独特优势是什么？(例如：专利设计、独家材质、极致性价比...)"
                            value={formData.sellingPoints}
                            onChange={e => setFormData({...formData, sellingPoints: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">当前的决策疑虑 (Concerns)</label>
                        <textarea 
                            className="w-full text-sm p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-16 resize-none placeholder:text-slate-400"
                            placeholder="你最担心什么？(例如：专利侵权风险？资金链断裂？)"
                            value={formData.concerns}
                            onChange={e => setFormData({...formData, concerns: e.target.value})}
                        />
                    </div>
                </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <div className="text-xs text-slate-400">
             <IconBrain className="inline w-3 h-3 mr-1" />
             AI 将基于 HEFM-Pro 模型进行评估
          </div>
          <div className="flex gap-3">
            <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
            >
                取消
            </button>
            <button 
                type="submit" 
                form="intakeForm"
                className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
                <IconCheck className="w-4 h-4" />
                生成评估请求
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};