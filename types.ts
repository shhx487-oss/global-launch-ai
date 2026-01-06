export enum MessageRole {
  User = 'user',
  Model = 'model',
  System = 'system'
}

export interface Attachment {
  name: string;
  type: string;
  data: string; // base64
}

// Chart Types
export type ChartType = 'swot' | 'radar' | 'assessment';

export interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  missingData?: {
    s?: boolean;
    w?: boolean;
    o?: boolean;
    t?: boolean;
  };
}

export interface RadarData {
  dimensions: {
    label: string;
    value: number; // 0-100
    comment?: string;
  }[];
  overallScore: number;
}

// New: Detailed Assessment Model
export interface AssessmentItem {
  category: string;
  score: number; // 0-10
  weight: number; // 0-1 (e.g. 0.2 for 20%)
  rationale: string; // Why this score?
  impact: 'High' | 'Medium' | 'Low';
}

export interface RiskItem {
  type: 'IP Infringement' | 'Platform Policy' | 'Data Privacy' | 'Logistics' | 'Safety';
  level: 'High' | 'Medium' | 'Low'; // Severity / Impact
  probability: 'High' | 'Medium' | 'Low'; // Likelihood
  description: string;
  mitigation: string; // Actionable advice
}

export interface AssessmentData {
  completeness: {
    score: number; // 0-100%
    status: 'Critical Missing' | 'Partial' | 'Sufficient';
    missingFields: string[]; // e.g., ["Packaging Dimensions", "Certifications"]
    acquiredFields?: string[]; // New: explicitly confirm what was found
  };
  decision: {
    result: 'GO' | 'NO-GO' | 'CONDITIONAL'; // Recommendation
    confidence: number; // 0-100%
    summary: string;
  };
  scoringTable: AssessmentItem[];
  risks?: RiskItem[]; 
  strategicQuestions?: string[]; // New: Questions to guide user thinking
}

export interface ChartPayload {
  type: ChartType;
  title: string;
  data: SwotData | RadarData | AssessmentData;
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  attachments?: Attachment[];
  chart?: ChartPayload; // New field for visual models
  timestamp: number;
  isThinking?: boolean;
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
  lastModified: number;
  mode: AppMode;
  persona: PersonaProfile;
}

export enum AppMode {
  ExpertAnalysis = 'expert',
  PersonaSimulation = 'persona'
}

export interface PersonaProfile {
  country: string;
  age: number;
  gender: string;
  occupation: string;
  interests: string;
  techSavviness: 'Low' | 'Medium' | 'High';
}

export const DEFAULT_PERSONA: PersonaProfile = {
  country: 'United States',
  age: 24,
  gender: 'Female',
  occupation: 'Content Creator',
  interests: 'TikTok trends, smart home gadgets, productivity',
  techSavviness: 'High'
};