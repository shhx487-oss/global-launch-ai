import React from 'react';
import { ChartPayload, SwotData, RadarData, AssessmentData, RiskItem } from '../types';

// Icons for SWOT
const IconStrength = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20M17 7l-5-5-5 5M12 22l5-5-5 5"/></svg>; 
const IconWeakness = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 17l-5 5-5-5"/></svg>; 
const IconOpportunity = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>; 
const IconThreat = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>; 
const IconAlert = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
const IconShield = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconCheckCircle = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IconLightbulb = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" x2="15" y1="18" y2="18"/><line x1="10" x2="14" y1="22" y2="22"/><path d="M15.09 14c.18-.9.27-1.85.26-2.83a8.55 8.55 0 0 0-2.86-6.38c-3.1-2.78-7.9-1.37-9.05 2.64a8.36 8.36 0 0 0 2.2 7.78 4.6 4.6 0 0 1 1.09 2.5z"/></svg>;

// --- Risk Item Component ---
const RiskPanel = ({ risks }: { risks: RiskItem[] }) => {
    if (!risks || risks.length === 0) return null;

    return (
        <div className="mt-5 p-5 bg-slate-50 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                <IconShield />
                <span>风险雷达与规避建议 (Risk & Mitigation)</span>
            </h4>
            <div className="space-y-3">
                {risks.map((risk, idx) => {
                    // Severity colors
                    let badgeColor = 'bg-slate-200 text-slate-700';
                    let borderClass = 'border-l-4 border-slate-300';
                    
                    if (risk.level === 'High') {
                        badgeColor = 'bg-rose-100 text-rose-700';
                        borderClass = 'border-l-4 border-rose-500';
                    } else if (risk.level === 'Medium') {
                        badgeColor = 'bg-amber-100 text-amber-700';
                        borderClass = 'border-l-4 border-amber-500';
                    } else {
                        badgeColor = 'bg-blue-100 text-blue-700';
                        borderClass = 'border-l-4 border-blue-500';
                    }

                    // Probability text style
                    let probColor = 'text-slate-500';
                    if (risk.probability === 'High') probColor = 'text-rose-600 font-semibold';
                    else if (risk.probability === 'Medium') probColor = 'text-amber-600 font-medium';

                    return (
                        <div key={idx} className={`bg-white p-3 rounded shadow-sm border border-slate-100 ${borderClass}`}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-xs text-slate-700">{risk.type}</span>
                                <div className="flex gap-2 items-center">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50/50 ${probColor}`}>
                                        Prob: {risk.probability || '?'}
                                    </span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${badgeColor}`}>
                                        Imp: {risk.level}
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-600 mb-2">{risk.description}</p>
                            <div className="text-xs bg-slate-50 p-2 rounded text-slate-500 italic">
                                <strong className="text-slate-600 not-italic">🛡️ 应对策略: </strong>
                                {risk.mitigation}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Strategic Questions Component (NEW) ---
const StrategyPanel = ({ questions }: { questions?: string[] }) => {
    if (!questions || questions.length === 0) return null;

    return (
        <div className="mt-0 p-5 bg-indigo-50/50 border-t border-indigo-100">
            <h4 className="font-bold text-indigo-900 text-sm mb-3 flex items-center gap-2">
                <IconLightbulb />
                <span>深度思考：战略引导 (Strategic Reflection)</span>
            </h4>
            <div className="space-y-2">
                {questions.map((q, idx) => (
                    <div key={idx} className="flex gap-3 items-start bg-white p-3 rounded border border-indigo-100 shadow-sm">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center mt-0.5">
                            {idx + 1}
                        </span>
                        <p className="text-xs text-indigo-900 font-medium leading-relaxed">{q}</p>
                    </div>
                ))}
            </div>
            <p className="text-[10px] text-indigo-400 mt-3 text-center">
                * 请在后续对话中补充上述信息，以提高评估准确度。
            </p>
        </div>
    );
};


// --- Assessment Card Component ---
const AssessmentCard = ({ data }: { data: AssessmentData }) => {
    if (!data) return null;

    const { completeness, decision, scoringTable, risks, strategicQuestions } = data;

    // Decision Colors
    let decisionColor = 'bg-slate-100 text-slate-600 border-slate-200';
    if (decision.result === 'GO') decisionColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (decision.result === 'NO-GO') decisionColor = 'bg-rose-100 text-rose-800 border-rose-300';
    if (decision.result === 'CONDITIONAL') decisionColor = 'bg-amber-100 text-amber-800 border-amber-300';

    return (
        <div className="w-full my-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* 1. Header & Completeness Audit */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-slate-800">HEFM 投资评估表</h3>
                        <span className="text-xs text-slate-500">Hardware Export Feasibility Model</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${decisionColor}`}>
                        {decision.result} (置信度 {decision.confidence}%)
                    </div>
                </div>

                {/* Data Completeness Bar */}
                <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-600">资料完整度审计 (Data Audit)</span>
                        <span className={`${completeness.score < 80 ? 'text-amber-600' : 'text-emerald-600'} font-bold`}>
                            {completeness.score}% - {completeness.status}
                        </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-500 ${completeness.score < 50 ? 'bg-rose-500' : completeness.score < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${completeness.score}%` }}
                        />
                    </div>
                    
                    {/* Data Fields Tags */}
                    <div className="flex flex-wrap gap-2 pt-1">
                        {/* Acquired Fields */}
                        {completeness.acquiredFields?.map((f, i) => (
                            <span key={`acq-${i}`} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 rounded text-[10px] text-emerald-700">
                                <IconCheckCircle /> {f}
                            </span>
                        ))}
                         {/* Missing Fields */}
                        {completeness.missingFields?.map((f, i) => (
                            <span key={`miss-${i}`} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-rose-50 border border-rose-100 rounded text-[10px] text-rose-700">
                                <IconAlert /> 缺失: {f}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. Detailed Scoring Table */}
            <div className="p-5">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                            <th className="pb-2 font-medium w-1/4">评估维度</th>
                            <th className="pb-2 font-medium w-16 text-center">得分</th>
                            <th className="pb-2 font-medium">逻辑推导 (Rationale)</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {scoringTable.map((item, idx) => (
                            <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 pr-2 font-medium text-slate-700">
                                    {item.category}
                                    <span className="block text-[10px] text-slate-400 font-normal mt-0.5">权重 {(item.weight * 100).toFixed(0)}%</span>
                                </td>
                                <td className="py-3 px-2 text-center">
                                    <span className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${
                                        item.score >= 8 ? 'bg-emerald-100 text-emerald-700' : 
                                        item.score >= 5 ? 'bg-amber-50 text-amber-700' : 
                                        'bg-rose-100 text-rose-700'
                                    }`}>
                                        {item.score}/10
                                    </span>
                                </td>
                                <td className="py-3 pl-2 text-slate-600 text-xs leading-relaxed">
                                    {item.rationale}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* 3. Strategic Questions (New) */}
            {strategicQuestions && strategicQuestions.length > 0 && <StrategyPanel questions={strategicQuestions} />}

            {/* 4. Risk Panel */}
            {risks && risks.length > 0 && <RiskPanel risks={risks} />}

            {/* 5. Executive Summary */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 text-xs text-slate-600 leading-relaxed italic">
                <span className="font-bold not-italic mr-1">💡 最终建议:</span>
                {decision.summary}
            </div>
        </div>
    );
};

// --- SWOT Matrix Component ---
const SwotMatrix = ({ data }: { data: SwotData }) => {
  if (!data) return null;

  const renderCard = (title: string, subtitle: string, items: string[] = [], type: 's'|'w'|'o'|'t', isMissing?: boolean) => {
    let bgClass = '';
    let borderClass = '';
    let textClass = '';
    let Icon = IconStrength;

    switch (type) {
        case 's': 
            bgClass = 'bg-emerald-50'; borderClass = 'border-emerald-200'; textClass = 'text-emerald-800'; 
            Icon = IconStrength; 
            break;
        case 'w': 
            bgClass = 'bg-rose-50'; borderClass = 'border-rose-200'; textClass = 'text-rose-800'; 
            Icon = IconWeakness;
            break;
        case 'o': 
            bgClass = 'bg-blue-50'; borderClass = 'border-blue-200'; textClass = 'text-blue-800'; 
            Icon = IconOpportunity;
            break;
        case 't': 
            bgClass = 'bg-amber-50'; borderClass = 'border-amber-200'; textClass = 'text-amber-800'; 
            Icon = IconThreat;
            break;
    }

    if (isMissing) {
        bgClass = 'bg-slate-50';
        borderClass = 'border-slate-200 border-dashed';
        textClass = 'text-slate-500';
    }

    return (
        <div className={`p-4 rounded-xl border-2 flex flex-col h-full transition-all hover:shadow-md ${bgClass} ${borderClass}`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${isMissing ? 'bg-slate-200' : 'bg-white/80'}`}>
                        <Icon />
                    </div>
                    <div>
                        <h4 className={`font-bold text-sm tracking-tight ${textClass}`}>{title}</h4>
                        <span className="text-[10px] opacity-70 block leading-none mt-0.5 uppercase tracking-wider">{subtitle}</span>
                    </div>
                </div>
                {isMissing && <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full font-medium">Data Missing</span>}
            </div>

            {isMissing && (!items || items.length === 0) ? (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-400 italic text-center p-2">
                    信息不足，无法评估<br/>建议补充产品细节
                </div>
            ) : (
                <ul className="space-y-2 flex-1">
                    {Array.isArray(items) && items.length > 0 ? items.map((item, idx) => (
                        <li key={idx} className="text-xs text-slate-700 leading-relaxed flex items-start gap-2 bg-white/60 p-1.5 rounded-md">
                            <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${textClass.replace('text-', 'bg-')}`}></span>
                            <span>{item}</span>
                        </li>
                    )) : (
                        <li className="text-xs text-slate-400 italic">无相关要点</li>
                    )}
                </ul>
            )}
        </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full my-6">
        <div className="flex items-center gap-2 mb-1 px-1">
            <h3 className="font-bold text-slate-700">SWOT 战略态势分析</h3>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">定性评估</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {renderCard('优势', 'Strengths', data.strengths, 's', data.missingData?.s)}
            {renderCard('劣势', 'Weaknesses', data.weaknesses, 'w', data.missingData?.w)}
            {renderCard('机会', 'Opportunities', data.opportunities, 'o', data.missingData?.o)}
            {renderCard('威胁', 'Threats', data.threats, 't', data.missingData?.t)}
        </div>
    </div>
  );
};

// --- Radar Chart Component (SVG) ---
const RadarChart = ({ data }: { data: RadarData }) => {
  const dimensions = Array.isArray(data?.dimensions) ? data.dimensions : [];
  
  if (dimensions.length === 0) {
      return null;
  }

  const size = 320;
  const center = size / 2;
  const radius = 100;
  const labels = dimensions.map(d => d.label || '未知维度');
  const values = dimensions.map(d => typeof d.value === 'number' ? d.value : 0);
  const count = labels.length;

  const getPoint = (value: number, index: number, max: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const points = values.map((v, i) => {
    const p = getPoint(v, i, 100);
    return `${p.x},${p.y}`;
  }).join(' ');

  const levels = [20, 40, 60, 80, 100];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm my-6 flex flex-col items-center">
      <div className="flex justify-between items-center w-full mb-4 border-b border-slate-100 pb-3">
         <div>
            <h3 className="font-bold text-slate-700">HEFM-Pro 7维选品雷达</h3>
            <span className="text-xs text-slate-400">出海可行性定量评估</span>
         </div>
         <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">综合评分</span>
            <span className={`text-xl font-bold ${
                (data.overallScore || 0) >= 75 ? 'text-emerald-600' : (data.overallScore || 0) >= 50 ? 'text-amber-500' : 'text-rose-500'
            }`}>
                {data.overallScore ?? '?'} <span className="text-sm text-slate-300">/100</span>
            </span>
         </div>
      </div>
      
      <svg width="100%" viewBox={`0 0 ${size} ${size}`} className="max-w-[320px]">
        {levels.map(level => (
          <polygon
            key={level}
            points={Array.from({ length: count }).map((_, i) => {
              const p = getPoint(level, i, 100);
              return `${p.x},${p.y}`;
            }).join(' ')}
            fill={level === 100 ? "#f8fafc" : "none"}
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray={level === 100 ? "0" : "4 2"}
          />
        ))}

        {Array.from({ length: count }).map((_, i) => {
          const p = getPoint(100, i, 100);
          return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#e2e8f0" strokeWidth="1" />;
        })}

        <polygon points={points} fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" />
        
        {values.map((v, i) => {
          const p = getPoint(v, i, 100);
          return <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />;
        })}

        {labels.map((label, i) => {
          const p = getPoint(130, i, 100);
          return (
            <g key={i}>
                <text
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] fill-slate-600 font-medium"
                style={{ fontSize: '10px' }}
                >
                {label}
                </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export const ChartRenderer = ({ chart }: { chart: ChartPayload }) => {
  if (!chart || !chart.data) return null;
  
  try {
    if (chart.type === 'swot') {
      return <SwotMatrix data={chart.data as SwotData} />;
    }
    if (chart.type === 'radar') {
      return <RadarChart data={chart.data as RadarData} />;
    }
    if (chart.type === 'assessment') {
      return <AssessmentCard data={chart.data as AssessmentData} />;
    }
  } catch (e) {
    console.error("Chart Render Error", e);
    return <div className="p-2 text-xs text-red-400 border border-red-100 bg-red-50 rounded">图表渲染错误</div>;
  }
  return null;
};