import React from 'react';
import type { CandidateInput, AnonymizationPreview } from '../types';
import { Tooltip } from './Tooltip';

interface ApplicationFormProps {
    jobTitle: string;
    setJobTitle: (value: string) => void;
    jobDescription: string;
    setJobDescription: (value: string) => void;
    candidates: CandidateInput[];
    addCandidate: () => void;
    removeCandidate: (id: number) => void;
    updateCandidate: (id: number, field: 'name' | 'resume', value: string) => void;
    customRules: string;
    setCustomRules: (value: string) => void;
    anonymize: boolean;
    setAnonymize: (value: boolean) => void;
    onSubmit: () => void;
    isLoading: boolean;
    anonymizationPreviews: Map<number, AnonymizationPreview>;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
    jobTitle,
    setJobTitle,
    jobDescription,
    setJobDescription,
    candidates,
    addCandidate,
    removeCandidate,
    updateCandidate,
    customRules,
    setCustomRules,
    anonymize,
    setAnonymize,
    onSubmit,
    isLoading,
    anonymizationPreviews
}) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-6">
            <div>
                <label htmlFor="job-title" className="block text-sm font-medium text-slate-700 mb-1">
                    Job Title
                </label>
                <input
                    type="text"
                    id="job-title"
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm transition duration-150 ease-in-out"
                    placeholder="e.g., Senior Frontend Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="job-description" className="block text-sm font-medium text-slate-700 mb-1">
                    Job Description
                </label>
                <textarea
                    id="job-description"
                    rows={8}
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Paste the full job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                />
            </div>
            
            <hr className="border-slate-200" />

            {candidates.map((candidate, index) => {
                const preview = anonymizationPreviews.get(candidate.id);

                return (
                <div key={candidate.id} className="p-4 border border-slate-200 rounded-lg space-y-4 relative bg-slate-50/50">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold text-slate-700">
                           {candidates.length > 1 ? `Candidate ${index + 1}` : `Applicant Details`}
                        </p>
                         {candidates.length > 1 && (
                            <button 
                                onClick={() => removeCandidate(candidate.id)}
                                className="text-slate-400 hover:text-red-600 transition-colors"
                                title="Remove Candidate"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                     <div>
                        <label htmlFor={`candidate-name-${candidate.id}`} className="block text-sm font-medium text-slate-700 mb-1">
                            Candidate Name
                        </label>
                        <input
                            type="text"
                            id={`candidate-name-${candidate.id}`}
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm transition duration-150 ease-in-out"
                            placeholder="e.g., Jane Doe"
                            value={candidate.name}
                            onChange={(e) => updateCandidate(candidate.id, 'name', e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor={`resume-${candidate.id}`} className="block text-sm font-medium text-slate-700 mb-1">
                            Resume / CV
                        </label>
                        <textarea
                            id={`resume-${candidate.id}`}
                            rows={10}
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm transition duration-150 ease-in-out"
                            placeholder={`Paste resume for ${candidate.name}...`}
                            value={candidate.resume}
                            onChange={(e) => updateCandidate(candidate.id, 'resume', e.target.value)}
                        />
                    </div>

                    {anonymize && candidate.resume.trim() && (
                         <div className="pt-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Anonymized Preview
                            </label>
                            <div className="w-full p-3 rounded-md border border-dashed border-slate-300 bg-white min-h-[10rem] text-sm text-slate-600 whitespace-pre-wrap">
                                {preview?.isLoading ? (
                                    <div className="flex items-center justify-center h-full text-slate-500">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Anonymizing...</span>
                                    </div>
                                ) : (
                                    preview?.text || 'Start typing to see the preview...'
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )})}
            
            <div>
                <button
                    onClick={addCandidate}
                    className="w-full flex justify-center items-center py-2 px-4 border border-dashed border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add another candidate
                </button>
            </div>

             <hr className="border-slate-200" />

            <div>
                 <div className="flex items-center space-x-1.5 mb-1">
                    <label htmlFor="scoring-rules" className="block text-sm font-medium text-slate-700">
                        Custom Scoring Rules <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <Tooltip text="Provide weighted criteria or must-have skills here. The AI will use these rules to prioritize its analysis and scoring, giving you more control over the evaluation.">
                        <span className="text-slate-400 cursor-help">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </Tooltip>
                </div>
                <textarea
                    id="scoring-rules"
                    rows={5}
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm transition duration-150 ease-in-out"
                    placeholder={"Define what's important. For example:\n- Leadership Experience (High weight)\n- Python & Django (Must-have)\n- Public Speaking (Bonus)"}
                    value={customRules}
                    onChange={(e) => setCustomRules(e.target.value)}
                />
            </div>
            <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                    <input
                        id="anonymize"
                        aria-describedby="anonymize-description"
                        name="anonymize"
                        type="checkbox"
                        checked={anonymize}
                        onChange={(e) => setAnonymize(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-secondary focus:ring-brand-secondary"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <div className="flex items-center space-x-1.5">
                        <label htmlFor="anonymize" className="font-medium text-slate-700">
                            Bias-Free Evaluation
                        </label>
                         <Tooltip text="When enabled, the AI is instructed to ignore personally identifiable information (like name, gender, etc.) to prevent bias and focus solely on skills and experience.">
                            <span className="text-slate-400 cursor-help">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </Tooltip>
                    </div>
                    <p id="anonymize-description" className="text-slate-500">
                        Anonymize PII to ensure a fair, unbiased analysis.
                    </p>
                </div>
            </div>
            <div className="pt-2">
                <button
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isLoading ? (
                         <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {candidates.length > 1 ? 'Comparing...' : 'Analyzing...'}
                        </>
                    ) : (
                       candidates.length > 1 ? 'Compare Candidates' : 'Analyze Application'
                    )}
                </button>
            </div>
        </div>
    );
};