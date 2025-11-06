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
    yearsOfExperience: number;
    highestEducation: string;
}

export interface CandidateInput {
    id: number;
    name: string;
    resume: string;
}

export interface ComparisonResult {
    comparisonSummary: string;
    candidateAnalyses: (Omit<AnalysisResult, 'yearsOfExperience' | 'highestEducation'> & { name: string; yearsOfExperience: number; highestEducation: string; })[];
    keyComparisons: {
        experience: string;
        education: string;
    };
}

export interface SkillsGapAnalysis {
    topInDemandSkills: string[];
    requiredSkills: string[];
    alignedSkills: string[];
    gapSkills: string[];
    surplusSkills: string[];
    analysisSummary: string;
}

export interface AnonymizationPreview {
    isLoading: boolean;
    text: string;
}