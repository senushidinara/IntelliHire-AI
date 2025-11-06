import React from 'react';

interface TooltipProps {
    text: string;
    children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
    return (
        <div className="relative flex items-center group">
            {children}
            <div className="absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 transform rounded-lg bg-slate-800 px-3 py-2 text-center text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {text}
                <div className="absolute left-1/2 top-full -ml-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-800"></div>
            </div>
        </div>
    );
};
