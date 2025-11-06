import React, { useState } from 'react';
import { ApplicationForm } from './components/ApplicationForm';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorAlert } from './components/ErrorAlert';
import { analyzeSingleResume, compareResumes } from './services/geminiService';
import type { AnalysisResult, ComparisonResult } from './types';
import { ComparisonResultDisplay } from './components/ComparisonResultDisplay';
import { AnalysisResultDisplay } from './components/AnalysisResultDisplay';

export interface Candidate {
    resume: string;
    fileName: string;
}

const App: React.FC = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [jobDescriptionFileName, setJobDescriptionFileName] = useState('');

    const [markingScheme, setMarkingScheme] = useState('');
    const [markingSchemeFileName, setMarkingSchemeFileName] = useState('');
    
    const [candidates, setCandidates] = useState<Candidate[]>([{ resume: '', fileName: '' }]);

    const [singleAnalysisResult, setSingleAnalysisResult] = useState<AnalysisResult | null>(null);
    const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileRead = (file: File, onSuccess: (content: string) => void) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            onSuccess(text);
        };
        reader.onerror = () => {
            setError(`Failed to read the file: ${file.name}`);
        };
        reader.readAsText(file);
    };

    const createInputHandler = (
        setText: React.Dispatch<React.SetStateAction<string>>,
        setFileName: React.Dispatch<React.SetStateAction<string>>
    ) => (data: { text?: string, file?: File | null }) => {
        if (data.file) {
            handleFileRead(data.file, (content) => {
                setText(content);
                setFileName(data.file?.name ?? '');
            });
        } else {
            setText(data.text ?? '');
            setFileName('');
        }
    };
    
    const handleJobDescriptionChange = createInputHandler(setJobDescription, setJobDescriptionFileName);
    const handleMarkingSchemeChange = createInputHandler(setMarkingScheme, setMarkingSchemeFileName);

    const handleCandidateChange = (index: number, data: { text?: string; file?: File | null }) => {
        const newCandidates = [...candidates];
        const targetCandidate = { ...newCandidates[index] };

        if (data.file) {
            handleFileRead(data.file, (content) => {
                targetCandidate.resume = content;
                targetCandidate.fileName = data.file?.name ?? '';
                newCandidates[index] = targetCandidate;
                setCandidates(newCandidates);
            });
        } else {
            targetCandidate.resume = data.text ?? '';
            targetCandidate.fileName = data.file ? data.file.name : '';
            newCandidates[index] = targetCandidate;
            setCandidates(newCandidates);
        }
    };
    
    const handleAddCandidate = () => {
        setCandidates([...candidates, { resume: '', fileName: '' }]);
    };
    
    const handleRemoveCandidate = (index: number) => {
        if (candidates.length > 1) {
            const newCandidates = candidates.filter((_, i) => i !== index);
            setCandidates(newCandidates);
        }
    };

    const handleAnalyze = async () => {
        const validCandidates = candidates.filter(c => c.resume.trim());

        if (!jobDescription.trim() || validCandidates.length === 0) {
            setError('Please provide a Job Description and at least one Candidate Resume.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSingleAnalysisResult(null);
        setComparisonResult(null);

        try {
            if (validCandidates.length === 1) {
                const analysis = await analyzeSingleResume(
                    jobDescription,
                    markingScheme,
                    validCandidates[0].resume
                );
                setSingleAnalysisResult(analysis);
            } else {
                const analysis = await compareResumes(
                    jobDescription,
                    markingScheme,
                    validCandidates.map(c => c.resume)
                );
                setComparisonResult(analysis);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to analyze the resumes. Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const formatSingleResultForEmail = (result: AnalysisResult): string => {
        let body = `Hello Hiring Manager,\n\nPlease find the AI-powered analysis for Candidate 1 below:\n\n`;
        body += `========================================\n`;
        body += `ANALYSIS FOR: Candidate 1\n`;
        body += `========================================\n`;
        body += `Recommendation: ${result.recommendation}\n`;
        body += `Match Score: ${result.matchScore}%\n\n`;
        body += `Summary:\n${result.summary}\n\n`;
        body += `Strengths:\n${result.strengths.map(s => `  - ${s}`).join('\n')}\n\n`;
        body += `Weaknesses:\n${result.weaknesses.map(w => `  - ${w}`).join('\n')}\n\n`;
        return body;
    };

    const formatComparisonResultForEmail = (result: ComparisonResult): string => {
        let body = `Hello Hiring Manager,\n\nPlease find the AI-powered comparison of the candidates below:\n\n`;
        body += `========================================\n`;
        body += `OVERALL SUMMARY & RECOMMENDATION\n`;
        body += `========================================\n`;
        body += `${result.comparisonSummary}\n\n`;

        result.candidateAnalyses.forEach(candidate => {
            body += `========================================\n`;
            body += `ANALYSIS FOR: ${candidate.name}\n`;
            body += `========================================\n`;
            body += `Recommendation: ${candidate.recommendation}\n`;
            body += `Match Score: ${candidate.matchScore}%\n\n`;
            body += `Summary:\n${candidate.summary}\n\n`;
            body += `Strengths:\n${candidate.strengths.map(s => `  - ${s}`).join('\n')}\n\n`;
            body += `Weaknesses:\n${candidate.weaknesses.map(w => `  - ${w}`).join('\n')}\n\n`;
        });
        return body;
    };

    const handleSendToManager = () => {
        let subject = "AI Resume Analysis";
        let body = "";

        if (singleAnalysisResult) {
            subject = "AI Resume Analysis for Candidate 1";
            body = formatSingleResultForEmail(singleAnalysisResult);
        } else if (comparisonResult) {
            subject = `AI Resume Comparison Analysis (${comparisonResult.candidateAnalyses.length} Candidates)`;
            body = formatComparisonResultForEmail(comparisonResult);
        } else {
            return;
        }

        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const validCandidateCount = candidates.filter(c => c.resume.trim()).length;

    return (
        <div className="min-h-screen bg-slate-100/50 text-slate-800">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <ApplicationForm
                        jobDescription={jobDescription}
                        jobDescriptionFileName={jobDescriptionFileName}
                        onJobDescriptionChange={handleJobDescriptionChange}
                        markingScheme={markingScheme}
                        markingSchemeFileName={markingSchemeFileName}
                        onMarkingSchemeChange={handleMarkingSchemeChange}
                        candidates={candidates}
                        onCandidateChange={handleCandidateChange}
                        onAddCandidate={handleAddCandidate}
                        onRemoveCandidate={handleRemoveCandidate}
                        onSubmit={handleAnalyze}
                        isLoading={isLoading}
                    />
                    <div className="lg:sticky lg:top-8 space-y-6">
                      {isLoading && <LoadingSpinner candidateCount={validCandidateCount} />}
                      {error && <ErrorAlert message={error} />}
                      
                      {singleAnalysisResult && (
                        <AnalysisResultDisplay result={singleAnalysisResult} candidateName="Candidate 1" onSendToManager={handleSendToManager} />
                      )}
                      
                      {comparisonResult && (
                        <ComparisonResultDisplay result={comparisonResult} onSendToManager={handleSendToManager} />
                      )}

                      {!isLoading && !error && !singleAnalysisResult && !comparisonResult && (
                        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center text-slate-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h3 className="mt-4 text-lg font-medium">IntelliHire AI Analysis</h3>
                          <p className="mt-1 text-sm">
                            Analysis results will be displayed here.
                          </p>
                        </div>
                      )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;