
import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-slate-200 text-center text-slate-500">
             <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-brand-secondary rounded-full animate-pulse-fast"></div>
                <div className="w-3 h-3 bg-brand-secondary rounded-full animate-pulse-fast [animation-delay:0.2s]"></div>
                <div className="w-3 h-3 bg-brand-secondary rounded-full animate-pulse-fast [animation-delay:0.4s]"></div>
            </div>
            <h3 className="mt-4 text-lg font-medium text-slate-700">Analyzing Candidate...</h3>
            <p className="mt-1 text-sm">
                The AI is reviewing the documents. This may take a moment.
            </p>
        </div>
    );
};
