import React from 'react';
import type { ComparisonResult } from '../types';
import { Recommendation } from '../types';

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

const ListItem: React.FC<{ children: React.ReactNode; type: 'strength' | 'weakness' }> = ({ children, type }) => {
    const iconColor = type === 'strength' ? 'text-green-500' : 'text-red-500';
    const icon = type === 'strength' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
    );

    return (
        <li className="flex items-start space-x-3">
            <div className={`flex-shrink-0 mt-0.5 ${iconColor}`}>{icon}</div>
            <span className="text-base text-slate-700 font-medium flex-1">{children}</span>
        </li>
    );
};

interface ComparisonResultDisplayProps {
    result: ComparisonResult;
    onSendToManager: () => void;
}

export const ComparisonResultDisplay: React.FC<ComparisonResultDisplayProps> = ({ result, onSendToManager }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-6 animate-fade-in">
             <div>
                <h2 className="text-lg font-semibold text-slate-800">AI Comparison Result</h2>
                <p className="text-sm text-slate-500">Side-by-side analysis based on your marking scheme.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                 <h3 className="text-base font-semibold text-slate-800 flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15v2a1 1 0 001 1h12a1 1 0 001-1v-2a1 1 0 00-.293-.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    Overall Summary & Recommendation
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{result.comparisonSummary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.candidateAnalyses.map((analysis) => {
                    const styles = recommendationStyles[analysis.recommendation];
                    return (
                        <div key={analysis.name} className="border border-slate-200 rounded-lg p-4 space-y-4 bg-white flex flex-col">
                             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <h3 className="text-base font-semibold text-slate-800 truncate" title={analysis.name}>{analysis.name}</h3>
                                <div className={`inline-flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-semibold ${styles.badge}`}>
                                    {styles.icon}
                                    <span>{analysis.recommendation}</span>
                                </div>
                            </div>

                             <div>
                                <div className="flex items-baseline justify-between">
                                    <span className="text-xs font-medium text-slate-500">Match Score</span>
                                    <span className={`text-xl font-bold ${styles.text}`}>{analysis.matchScore}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                                    <div className="bg-brand-secondary h-2 rounded-full" style={{ width: `${analysis.matchScore}%` }}></div>
                                </div>
                            </div>
                            
                            <div className="text-sm text-slate-600 py-2 border-y border-slate-100">
                                {analysis.summary}
                            </div>


                            <div className="flex-grow">
                                <h4 className="text-sm font-semibold text-slate-700 mb-2">Strengths</h4>
                                <ul className="space-y-1.5">
                                    {analysis.strengths.map((strength, index) => (
                                        <ListItem key={index} type="strength">{strength}</ListItem>
                                    ))}
                                    {analysis.strengths.length === 0 && <p className="text-sm text-slate-500 italic">No specific strengths identified.</p>}
                                </ul>
                            </div>
                             <div className="flex-grow">
                                <h4 className="text-sm font-semibold text-slate-700 mb-2 pt-2 border-t border-slate-100">Weaknesses</h4>
                                <ul className="space-y-1.5">
                                    {analysis.weaknesses.map((weakness, index) => (
                                       <ListItem key={index} type="weakness">{weakness}</ListItem>
                                    ))}
                                    {analysis.weaknesses.length === 0 && <p className="text-sm text-slate-500 italic">No specific weaknesses identified.</p>}
                                </ul>
                            </div>
                        </div>
                    )
                })}
            </div>

             <div className="pt-4 border-t border-slate-200">
                <button
                    onClick={onSendToManager}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors duration-200"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                       <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                       <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                     </svg>
                     Send to Hiring Manager
                </button>
            </div>
        </div>
    );
};
