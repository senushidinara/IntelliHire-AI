export enum Recommendation {
    SELECT = 'SELECT',
    CONSIDER = 'CONSIDER',
    REJECT = 'REJECT',
}

export interface AnalysisResult {
    recommendation: Recommendation;
    matchScore: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
}

export interface ComparisonResult {
    comparisonSummary: string;
    candidateAnalyses: (AnalysisResult & { name: string })[];
}

// FIX: Added missing SkillsGapAnalysis interface to resolve compilation error.
export interface SkillsGapAnalysis {
    topInDemandSkills: string[];
    requiredSkills: string[];
    alignedSkills: string[];
    gapSkills: string[];
    surplusSkills: string[];
    analysisSummary: string;
}
