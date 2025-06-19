
export interface TargetAudience {
  ageMin: string;
  ageMax:string;
  gender: string;
  location: string;
  interests: string;
}

export interface InstagramContent {
  link: string;
  caption: string;
}

export enum AnalysisCriteriaKey {
  INTERACTIVITY = "interactivity",
  ENTERTAINMENT = "entertainment",
  RELEVANCE = "relevance",
  INFORMATIVENESS = "informativeness",
}

export interface CriteriaReport {
  score: number; // 0-10
  explanation: string;
}

export interface AnalysisReport {
  [AnalysisCriteriaKey.INTERACTIVITY]: CriteriaReport;
  [AnalysisCriteriaKey.ENTERTAINMENT]: CriteriaReport;
  [AnalysisCriteriaKey.RELEVANCE]: CriteriaReport;
  [AnalysisCriteriaKey.INFORMATIVENESS]: CriteriaReport;
  purchaseInfluence: {
    likelihood: string; // e.g., 'Rendah', 'Sedang', 'Tinggi'
    explanation: string;
  };
  overallSummary: string;
  suggestions: string[];
}

export const GENDER_OPTIONS = [
  { value: "Semua", label: "Semuanya Boleh" },
  { value: "Pria", label: "Cowok" },
  { value: "Wanita", label: "Cewek" },
];
