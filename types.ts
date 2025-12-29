export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  ANALYZER = 'ANALYZER',
  REDIRECT = 'REDIRECT'
}

export interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  isPositive?: boolean;
}

export interface CreativeAnalysisResult {
  risk: 'Baixo' | 'Médio' | 'Alto' | 'Fatal';
  hook: string;
  friction: string;
  suggestion: string;
}
