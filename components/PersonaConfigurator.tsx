import React from 'react';
import { PersonaProfile } from '../types';

interface Props {
  profile: PersonaProfile;
  onChange: (p: PersonaProfile) => void;
}

export const PersonaConfigurator: React.FC<Props> = ({ profile, onChange }) => {
  const handleChange = (field: keyof PersonaProfile, value: any) => {
    onChange({ ...profile, [field]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <span>目标用户画像</span>
        <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">仿真模拟中</span>
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">目标市场 (国家/地区)</label>
          <select 
            className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={profile.country}
            onChange={(e) => handleChange('country', e.target.value)}
          >
            <option value="United States">United States (美国)</option>
            <option value="United Kingdom">United Kingdom (英国)</option>
            <option value="Germany">Germany (德国)</option>
            <option value="Japan">Japan (日本)</option>
            <option value="Brazil">Brazil (巴西)</option>
            <option value="France">France (法国)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">年龄</label>
                <input 
                    type="number" 
                    className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={profile.age}
                    onChange={(e) => handleChange('age', parseInt(e.target.value) || 18)}
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">性别</label>
                <select 
                    className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={profile.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                >
                    <option value="Male">男性</option>
                    <option value="Female">女性</option>
                    <option value="Non-binary">非二元性别</option>
                </select>
            </div>
        </div>

        <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">职业</label>
            <input 
                type="text" 
                className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={profile.occupation}
                onChange={(e) => handleChange('occupation', e.target.value)}
            />
        </div>

        <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">兴趣爱好</label>
            <textarea 
                className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none h-16 resize-none"
                value={profile.interests}
                onChange={(e) => handleChange('interests', e.target.value)}
            />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">科技敏感度 (Tech Savviness)</label>
          <div className="flex gap-2 text-xs">
            {['Low', 'Medium', 'High'].map((level) => {
                const labelMap: Record<string, string> = { Low: '低', Medium: '中', High: '高' };
                return (
                    <button
                        key={level}
                        className={`flex-1 py-1.5 rounded border transition-colors ${
                            profile.techSavviness === level 
                            ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                        onClick={() => handleChange('techSavviness', level)}
                    >
                        {labelMap[level]}
                    </button>
                )
            })}
          </div>
        </div>

      </div>
    </div>
  );
};