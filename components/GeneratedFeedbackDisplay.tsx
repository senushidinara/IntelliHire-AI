import React, { useState } from 'react';

interface GeneratedFeedbackDisplayProps {
    feedback: string;
}

export const GeneratedFeedbackDisplay: React.FC<GeneratedFeedbackDisplayProps> = ({ feedback }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(feedback);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-slate-800">Generated Candidate Feedback</h3>
                <button
                    onClick={handleCopy}
                    className="inline-flex items-center space-x-2 text-sm font-medium text-brand-secondary hover:text-brand-primary transition-colors duration-150"
                >
                    {copied ? (
                        <>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                           </svg>
                           <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copy to Clipboard</span>
                        </>
                    )}
                </button>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 whitespace-pre-wrap text-sm text-slate-700">
                {feedback}
            </div>
        </div>
    );
};