import React from 'react';
import type { SkillsGapAnalysis } from '../types';
import { Tooltip } from './Tooltip';

interface BadgeProps {
    text: string;
    color: 'green' | 'red' | 'blue' | 'gray';
}

const InfoIcon = () => (
    <span className="text-slate-400 cursor-help">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
    </span>
);

const SkillBadge: React.FC<BadgeProps> = ({ text, color }) => {
    const colorClasses = {
        green: 'bg-green-100 text-green-800 border-green-200',
        red: 'bg-red-100 text-red-800 border-red-200',
        blue: 'bg-blue-100 text-blue-800 border-blue-200',
        gray: 'bg-slate-100 text-slate-800 border-slate-200',
    };
    return (
        <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${colorClasses[color]}`}>
            {text}
        </span>
    );
}

export const SkillsGapDisplay: React.FC<{ result: SkillsGapAnalysis }> = ({ result }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-6 animate-fade-in">
            <div>
                <h2 className="text-lg font-semibold text-slate-800">Applicant Pool Skill Analysis</h2>
                <p className="text-sm text-slate-500">A high-level view of your talent pipeline.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="flex items-center space-x-1.5 mb-3">
                        <h3 className="text-base font-semibold text-slate-800">Top In-Demand Skills <span className="text-sm text-slate-500 font-normal">(from candidates)</span></h3>
                        <Tooltip text="These are the top 3 most frequently mentioned skills across all the candidate resumes you've submitted for analysis.">
                           <InfoIcon />
                        </Tooltip>
                    </div>
                    <div className="flex flex-wrap gap-2">
                         {result.topInDemandSkills.length > 0 ? (
                            result.topInDemandSkills.map((skill) => <SkillBadge key={skill} text={skill} color="gray" />)
                         ) : <p className="text-sm text-slate-500">No prominent skills identified.</p>}
                    </div>
                </div>
                 <div>
                    <div className="flex items-center space-x-1.5 mb-3">
                        <h3 className="text-base font-semibold text-slate-800">Key Required Skills <span className="text-sm text-slate-500 font-normal">(from job description)</span></h3>
                        <Tooltip text="These are the essential skills that the AI has extracted directly from the job description you provided.">
                            <InfoIcon />
                        </Tooltip>
                    </div>
                     <div className="flex flex-wrap gap-2">
                         {result.requiredSkills.length > 0 ? (
                            result.requiredSkills.map((skill) => <SkillBadge key={skill} text={skill} color="gray" />)
                         ) : <p className="text-sm text-slate-500">No required skills identified.</p>}
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-base font-semibold text-slate-800 mb-3">Comparison & Findings</h3>
                <div className="space-y-4">
                    {result.alignedSkills.length > 0 && (
                        <div>
                            <div className="flex items-center space-x-1.5 mb-2">
                                <h4 className="text-sm font-semibold text-green-700">✅ Aligned Skills</h4>
                                <Tooltip text="Skills that are both required by the job and are commonly found within your current applicant pool.">
                                    <InfoIcon />
                                </Tooltip>
                            </div>
                             <div className="flex flex-wrap gap-2">
                                {result.alignedSkills.map((skill) => <SkillBadge key={skill} text={skill} color="green" />)}
                            </div>
                        </div>
                    )}
                     {result.gapSkills.length > 0 && (
                        <div>
                            <div className="flex items-center space-x-1.5 mb-2">
                                <h4 className="text-sm font-semibold text-red-700">❌ Skill Gaps</h4>
                                <Tooltip text="Important skills required for the role that are missing or rare among the analyzed candidates. This might indicate a need to adjust sourcing strategy.">
                                    <InfoIcon />
                                </Tooltip>
                            </div>
                             <div className="flex flex-wrap gap-2">
                                {result.gapSkills.map((skill) => <SkillBadge key={skill} text={skill} color="red" />)}
                            </div>
                        </div>
                    )}
                     {result.surplusSkills.length > 0 && (
                        <div>
                            <div className="flex items-center space-x-1.5 mb-2">
                                <h4 className="text-sm font-semibold text-blue-700">💡 Surplus Skills</h4>
                                 <Tooltip text="Skills that your candidates frequently have, but were not listed as requirements in the job description. These could be hidden strengths of your applicant pool.">
                                    <InfoIcon />
                                </Tooltip>
                            </div>
                             <div className="flex flex-wrap gap-2">
                                {result.surplusSkills.map((skill) => <SkillBadge key={skill} text={skill} color="blue" />)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
             <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                 <h3 className="text-base font-semibold text-slate-800 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    AI Summary
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{result.analysisSummary}</p>
            </div>

        </div>
    );
};