import React from 'react';
import type { AnalysisResult } from '../types';
import { Recommendation } from '../types';
import { Tooltip } from './Tooltip';

interface AnalysisResultDisplayProps {
    result: AnalysisResult;
    candidateName: string;
    onGenerateFeedback: () => void;
    isGeneratingFeedback: boolean;
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

const ListItem: React.FC<{ children: React.ReactNode; type: 'strength' | 'weakness' }> = ({ children, type }) => {
    const iconColor = type === 'strength' ? 'text-green-500' : 'text-red-500';
    const icon = type === 'strength' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
    );

    return (
        <li className="flex items-start space-x-3">
            <div className={`flex-shrink-0 mt-0.5 ${iconColor}`}>{icon}</div>
            <span className="text-slate-600">{children}</span>
        </li>
    );
};

export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result, candidateName, onGenerateFeedback, isGeneratingFeedback, onExport }) => {
    const styles = recommendationStyles[result.recommendation];
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-800">AI Analysis: <span className="font-bold">{candidateName}</span></h2>
                    <p className="text-sm text-slate-500">Based on the provided documents.</p>
                </div>
                 <Tooltip text={recommendationTooltips[result.recommendation]}>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-semibold ${styles.badge} self-start cursor-help`}>
                        {styles.icon}
                        <span>{result.recommendation}</span>
                    </div>
                </Tooltip>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-baseline justify-between">
                     <div className="flex items-center space-x-1.5">
                        <span className="text-sm font-medium text-slate-600">Match Score</span>
                        <Tooltip text="An AI-generated score from 0-100 representing how well the candidate's skills and experience align with the job description and any custom rules you've provided.">
                             <span className="text-slate-400 cursor-help">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </Tooltip>
                    </div>
                    <span className={`text-2xl font-bold ${styles.text}`}>{result.matchScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
                    <div className="bg-brand-secondary h-2.5 rounded-full" style={{ width: `${result.matchScore}%` }}></div>
                </div>
            </div>

            <div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">Summary</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{result.summary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-3">Strengths</h3>
                    <ul className="space-y-2">
                        {result.strengths.map((strength, index) => (
                            <ListItem key={index} type="strength">{strength}</ListItem>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-3">Weaknesses</h3>
                    <ul className="space-y-2">
                        {result.weaknesses.map((weakness, index) => (
                           <ListItem key={index} type="weakness">{weakness}</ListItem>
                        ))}
                    </ul>
                </div>
            </div>
             <div className="pt-4 border-t border-slate-200 flex flex-col md:flex-row gap-3">
                <button
                    onClick={onGenerateFeedback}
                    disabled={isGeneratingFeedback}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-secondary hover:bg-brand-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isGeneratingFeedback ? (
                         <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating Feedback...
                        </>
                    ) : (
                        <>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                           <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                         </svg>
                         Generate Candidate Feedback
                        </>
                    )}
                </button>
                <button
                    onClick={onExport}
                    className="w-full md:w-auto flex-shrink-0 flex justify-center items-center py-2.5 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export to CSV
                </button>
            </div>
        </div>
    );
};