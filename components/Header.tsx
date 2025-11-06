import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm border-b border-slate-200">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center space-x-3">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">IntelliHire <span className="text-brand-secondary">AI</span></h1>
                        <p className="text-xs text-slate-500 -mt-0.5">Talent selection, reimagined by intelligence — not intuition.</p>
                    </div>
                </div>
            </div>
        </header>
    );
};