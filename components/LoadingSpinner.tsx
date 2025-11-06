import React from 'react';

interface LoadingSpinnerProps {
    candidateCount: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ candidateCount }) => {
    const text = candidateCount > 1 ? 'Comparing Resumes...' : 'Analyzing Resume...';

    return (
        <div className="bg-gradient-to-br from-cyan-50 to-teal-50 backdrop-blur-sm p-10 rounded-2xl shadow-xl border-2 border-cyan-200 text-center">
             <div className="flex items-center justify-center space-x-3">
                <div className="w-4 h-4 bg-cyan-500 rounded-full animate-pulse-fast"></div>
                <div className="w-4 h-4 bg-teal-500 rounded-full animate-pulse-fast [animation-delay:0.2s]"></div>
                <div className="w-4 h-4 bg-cyan-500 rounded-full animate-pulse-fast [animation-delay:0.4s]"></div>
            </div>
            <h3 className="mt-6 text-2xl font-bold text-teal-800">✨ {text}</h3>
            <p className="mt-3 text-base text-teal-600">
                The AI is reviewing the documents. This may take a moment.
            </p>
        </div>
    );
};
