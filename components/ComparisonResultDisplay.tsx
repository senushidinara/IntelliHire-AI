import React from 'react';
import type { ComparisonResult } from '../types';
import { Recommendation } from '../types';
import { Tooltip } from './Tooltip';

interface ComparisonResultDisplayProps {
    result: ComparisonResult;
    onExport: () => void;
}

const recommendationStyles = {
    [Recommendation.SELECT]: {
        badge: 'bg-green-100 text-green-800',
        text: 'text-green-600',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        )
    },
    [Recommendation.CONSIDER]: {
        badge: 'bg-yellow-100 text-yellow-800',
        text: 'text-yellow-600',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 13a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM9 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
        )
    },
    [Recommendation.REJECT]: {
        badge: 'bg-red-100 text-red-800',
        text: 'text-red-600',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
        )
    },
};

const recommendationTooltips = {
    [Recommendation.SELECT]: "Excellent fit. Candidate meets all critical requirements and shows strong alignment with the role.",
    [Recommendation.CONSIDER]: "Strong potential. Candidate meets most key requirements but may have some manageable gaps in secondary skills.",
    [Recommendation.REJECT]: "Poor fit. Candidate fails to meet critical requirements for the role.",
};

type DiffType = 'unique' | 'partial';

const DiffIcon: React.FC<{ type: DiffType }> = ({ type }) => {
    if (type === 'unique') {
        return (
            <Tooltip text="This is a unique strength/weakness that only this candidate possesses in this comparison.">
                <span className="flex-shrink-0 text-yellow-500 cursor-help">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </span>
            </Tooltip>
        );
    }
    if (type === 'partial') {
        return (
             <Tooltip text="This trait is shared with some, but not all, other candidates in this comparison.">
                <span className="flex-shrink-0 text-sky-500 cursor-help">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0l-1.5-1.5a2 2 0 112.828-2.828l1.5 1.5l3-3zm-2.828 8.414a2 2 0 012.828 0l3 3a2 2 0 01-2.828 2.828l-3-3a2 2 0 010-2.828zM10 9.5a2 2 0 11-2.828-2.828l-3 3a2 2 0 11-2.828 2.828l3-3a2 2 0 012.828 0l-1.5 1.5a2 2 0 112.828 2.828l1.5-1.5z" clipRule="evenodd" />
                    </svg>
                </span>
            </Tooltip>
        );
    }
    return null;
}

const ListItem: React.FC<{ children: React.ReactNode; type: 'strength' | 'weakness'; diffType?: DiffType }> = ({ children, type, diffType }) => {
    const iconColor = type === 'strength' ? 'text-green-500' : 'text-red-500';
    const icon = type === 'strength' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
    );

    return (
        <li className="flex items-start space-x-2">
            <div className={`flex-shrink-0 mt-0.5 ${iconColor}`}>{icon}</div>
            <span className="text-slate-600 text-sm flex-1">{children}</span>
            {diffType && <DiffIcon type={diffType} />}
        </li>
    );
};


export const ComparisonResultDisplay: React.FC<ComparisonResultDisplayProps> = ({ result, onExport }) => {
    // Logic for diffing strengths, weaknesses, and scores
    const allStrengths = new Map<string, number>();
    const allWeaknesses = new Map<string, number>();
    const normalize = (s: string) => s.trim().toLowerCase();
    const totalCandidates = result.candidateAnalyses.length;

    const scores = result.candidateAnalyses.map(c => c.matchScore);
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    const shouldShowScoreOutliers = totalCandidates >= 3 && highestScore !== lowestScore;


    result.candidateAnalyses.forEach(candidate => {
        candidate.strengths.forEach(strength => {
            const norm = normalize(strength);
            allStrengths.set(norm, (allStrengths.get(norm) || 0) + 1);
        });
        candidate.weaknesses.forEach(weakness => {
            const norm = normalize(weakness);
            allWeaknesses.set(norm, (allWeaknesses.get(norm) || 0) + 1);
        });
    });

    const getDiffType = (text: string, map: Map<string, number>): DiffType | undefined => {
        if (totalCandidates <= 1) return undefined;
        const count = map.get(normalize(text));
        if (count === 1) return 'unique';
        if (count && count > 1 && count < totalCandidates) return 'partial';
        return undefined;
    };
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-6 animate-fade-in">
             <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-800">AI Comparison Result</h2>
                    <p className="text-sm text-slate-500">Based on the provided documents.</p>
                </div>
                <button
                    onClick={onExport}
                    className="w-full sm:w-auto flex-shrink-0 flex justify-center items-center py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export to CSV
                </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                 <div className="flex items-center space-x-1.5 mb-2">
                    <h3 className="text-base font-semibold text-slate-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15v2a1 1 0 001 1h12a1 1 0 001-1v-2a1 1 0 00-.293-.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                        Comparison Summary & Ranking
                    </h3>
                    <Tooltip text="This is the AI's high-level synthesis, ranking all candidates and explaining the key differentiators that led to its conclusion.">
                        <span className="text-slate-400 cursor-help">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </Tooltip>
                 </div>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{result.comparisonSummary}</p>
            </div>

            <div className="space-y-4">
                <h3 className="text-base font-semibold text-slate-800">Key Comparative Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <h4 className="font-semibold text-sm text-slate-700 mb-1">Experience Level</h4>
                        <p className="text-sm text-slate-600">{result.keyComparisons.experience}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <h4 className="font-semibold text-sm text-slate-700 mb-1">Educational Background</h4>
                        <p className="text-sm text-slate-600">{result.keyComparisons.education}</p>
                    </div>
                </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-${result.candidateAnalyses.length > 1 ? '2' : '1'} lg:grid-cols-${result.candidateAnalyses.length > 2 ? '3' : result.candidateAnalyses.length} gap-4`}>
                {result.candidateAnalyses.map((analysis) => {
                    const styles = recommendationStyles[analysis.recommendation];
                    const isTopScore = shouldShowScoreOutliers && analysis.matchScore === highestScore;
                    const isLowestScore = shouldShowScoreOutliers && analysis.matchScore === lowestScore;
                    return (
                        <div key={analysis.name} className="border border-slate-200 rounded-lg p-4 space-y-4 bg-white flex flex-col">
                             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <h3 className="text-base font-semibold text-slate-800 truncate" title={analysis.name}>{analysis.name}</h3>
                                <Tooltip text={recommendationTooltips[analysis.recommendation]}>
                                    <div className={`inline-flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-semibold ${styles.badge} cursor-help`}>
                                        {styles.icon}
                                        <span>{analysis.recommendation}</span>
                                    </div>
                                </Tooltip>
                            </div>

                             <div>
                                <div className="flex items-baseline justify-between">
                                    <div className="flex items-center space-x-1">
                                        <span className="text-xs font-medium text-slate-500">Match Score</span>
                                        <Tooltip text="An AI-generated score from 0-100 representing how well the candidate's skills and experience align with the job description and any custom rules you've provided.">
                                            <span className="text-slate-400 cursor-help">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        </Tooltip>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {isTopScore && (
                                            <Tooltip text="Highest score in this comparison.">
                                                <span className="text-green-500">
                                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </span>
                                            </Tooltip>
                                        )}
                                        {isLowestScore && (
                                            <Tooltip text="Lowest score in this comparison.">
                                                <span className="text-red-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10 12l-5-5h10l-5 5z" />
                                                    </svg>
                                                </span>
                                            </Tooltip>
                                        )}
                                        <span className={`text-xl font-bold ${styles.text}`}>{analysis.matchScore}%</span>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                                    <div className="bg-brand-secondary h-2 rounded-full" style={{ width: `${analysis.matchScore}%` }}></div>
                                </div>
                            </div>
                            
                            <div className="text-xs text-slate-500 space-y-1 py-2 border-y border-slate-100">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Experience:</span>
                                    <span className="font-semibold text-slate-700">{analysis.yearsOfExperience} years</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Education:</span>
                                    <span className="font-semibold text-slate-700 text-right truncate" title={analysis.highestEducation}>{analysis.highestEducation}</span>
                                </div>
                            </div>


                            <div className="flex-grow">
                                <h4 className="text-sm font-semibold text-slate-700 mb-2">Strengths</h4>
                                <ul className="space-y-1.5">
                                    {analysis.strengths.map((strength, index) => (
                                        <ListItem key={index} type="strength" diffType={getDiffType(strength, allStrengths)}>{strength}</ListItem>
                                    ))}
                                </ul>
                            </div>
                             <div className="flex-grow">
                                <h4 className="text-sm font-semibold text-slate-700 mb-2 pt-2 border-t border-slate-100">Weaknesses</h4>
                                <ul className="space-y-1.5">
                                    {analysis.weaknesses.map((weakness, index) => (
                                       <ListItem key={index} type="weakness" diffType={getDiffType(weakness, allWeaknesses)}>{weakness}</ListItem>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};