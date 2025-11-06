import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ApplicationForm } from './components/ApplicationForm';
import { AnalysisResultDisplay } from './components/AnalysisResultDisplay';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorAlert } from './components/ErrorAlert';
import { analyzeSingleCandidate, compareCandidates, generateFeedbackForCandidate, analyzeSkillsGap, anonymizeResume } from './services/geminiService';
import type { AnalysisResult, ComparisonResult, CandidateInput, SkillsGapAnalysis, AnonymizationPreview } from './types';
import { FeedbackForm } from './components/FeedbackForm';
import { GeneratedFeedbackDisplay } from './components/GeneratedFeedbackDisplay';
import { ComparisonResultDisplay } from './components/ComparisonResultDisplay';
import { SkillsGapDisplay } from './components/SkillsGapDisplay';
import { exportSingleCandidateToCsv, exportComparisonToCsv } from './utils/exportUtils';

// Type guard to check if the result is a ComparisonResult
const isComparisonResult = (result: any): result is ComparisonResult => {
    return result && result.hasOwnProperty('comparisonSummary');
};

const App: React.FC = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [customRules, setCustomRules] = useState('');
    const [anonymize, setAnonymize] = useState(true);
    const [candidates, setCandidates] = useState<CandidateInput[]>([{ id: Date.now(), name: 'Candidate 1', resume: '' }]);

    const [result, setResult] = useState<AnalysisResult | ComparisonResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // AI-generated feedback state
    const [generatedFeedback, setGeneratedFeedback] = useState<string | null>(null);
    const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
    
    // Skills gap analysis state
    const [skillsGapResult, setSkillsGapResult] = useState<SkillsGapAnalysis | null>(null);
    const [isAnalyzingSkills, setIsAnalyzingSkills] = useState(false);

    // Anonymization preview state
    const [anonymizationPreviews, setAnonymizationPreviews] = useState<Map<number, AnonymizationPreview>>(new Map());
    const debounceTimers = useRef<Map<number, number>>(new Map());


    // Feedback for the AI state
    const [feedbackRating, setFeedbackRating] = useState<'helpful' | 'unhelpful' | null>(null);
    const [feedbackComments, setFeedbackComments] = useState('');
    const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
    
    const triggerAnonymization = useCallback(async (candidateId: number, resume: string) => {
        setAnonymizationPreviews(prev => new Map(prev).set(candidateId, { isLoading: true, text: 'Anonymizing...' }));
        try {
            const anonymizedText = await anonymizeResume(resume);
            setAnonymizationPreviews(prev => new Map(prev).set(candidateId, { isLoading: false, text: anonymizedText }));
        } catch (error) {
            console.error('Anonymization failed:', error);
            setAnonymizationPreviews(prev => new Map(prev).set(candidateId, { isLoading: false, text: 'Could not anonymize resume.' }));
        }
    }, []);

    const debouncedAnonymize = useCallback((candidateId: number, resume: string) => {
        if (debounceTimers.current.has(candidateId)) {
            clearTimeout(debounceTimers.current.get(candidateId)!);
        }
        const timer = window.setTimeout(() => {
            triggerAnonymization(candidateId, resume);
        }, 750);
        debounceTimers.current.set(candidateId, timer);
    }, [triggerAnonymization]);

    useEffect(() => {
        if (!anonymize) {
            setAnonymizationPreviews(new Map());
            debounceTimers.current.forEach(timer => clearTimeout(timer));
            debounceTimers.current.clear();
        }
    }, [anonymize]);


    const handleAnalyze = async () => {
        if (!jobTitle.trim() || !jobDescription.trim() || candidates.some(c => !c.resume.trim())) {
            setError('Please provide a Job Title, Job Description, and a Resume for each candidate.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        setGeneratedFeedback(null);
        setSkillsGapResult(null);

        setIsFeedbackSubmitted(false);
        setFeedbackRating(null);
        setFeedbackComments('');

        try {
            if (candidates.length > 1) {
                // Comparison Mode
                const analysis = await compareCandidates(jobDescription, candidates, customRules, anonymize);
                setResult(analysis);
                
                // Fire and forget skills analysis - no need to block UI
                setIsAnalyzingSkills(true);
                analyzeSkillsGap(jobDescription, candidates.map(c => c.resume))
                    .then(skillsResult => {
                        setSkillsGapResult(skillsResult);
                    }).catch(err => {
                        console.error("Skill analysis failed:", err);
                    }).finally(() => {
                        setIsAnalyzingSkills(false);
                    });

            } else {
                // Single Analysis Mode
                const analysis = await analyzeSingleCandidate(jobDescription, candidates[0].resume, customRules, anonymize);
                setResult(analysis);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to analyze the application(s). Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGenerateFeedback = async () => {
        if (!result || isComparisonResult(result) || !jobTitle) return;

        setIsGeneratingFeedback(true);
        setGeneratedFeedback(null);
        setError(null);

        try {
            const feedbackText = await generateFeedbackForCandidate(jobTitle, result);
            setGeneratedFeedback(feedbackText);
        } catch (err) {
            console.error(err);
            setError('Failed to generate feedback for the candidate.');
        } finally {
            setIsGeneratingFeedback(false);
        }
    };

    const handleFeedbackSubmit = () => {
        console.log("Feedback submitted:", {
            rating: feedbackRating,
            comments: feedbackComments,
            analysisOn: result,
        });
        setIsFeedbackSubmitted(true);
    };

    const addCandidate = () => {
        setCandidates([...candidates, { id: Date.now(), name: `Candidate ${candidates.length + 1}`, resume: '' }]);
    };

    const removeCandidate = (id: number) => {
        setCandidates(candidates.filter(c => c.id !== id));
    };

    const updateCandidate = (id: number, field: 'name' | 'resume', value: string) => {
        setCandidates(prevCandidates => prevCandidates.map(c => c.id === id ? { ...c, [field]: value } : c));

        if (field === 'resume' && anonymize) {
            if (value.trim()) {
                debouncedAnonymize(id, value);
            } else {
                setAnonymizationPreviews(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(id);
                    return newMap;
                });
                if (debounceTimers.current.has(id)) {
                    clearTimeout(debounceTimers.current.get(id)!);
                    debounceTimers.current.delete(id);
                }
            }
        }
    };
    
    const handleExportSingle = () => {
        if (result && !isComparisonResult(result) && candidates.length > 0) {
            exportSingleCandidateToCsv(result, jobTitle, candidates[0].name);
        }
    };

    const handleExportComparison = () => {
        if (result && isComparisonResult(result)) {
            exportComparisonToCsv(result, jobTitle);
        }
    };


    return (
        <div className="min-h-screen bg-slate-100/50 text-slate-800">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <ApplicationForm
                        jobTitle={jobTitle}
                        setJobTitle={setJobTitle}
                        jobDescription={jobDescription}
                        setJobDescription={setJobDescription}
                        candidates={candidates}
                        addCandidate={addCandidate}
                        removeCandidate={removeCandidate}
                        updateCandidate={updateCandidate}
                        customRules={customRules}
                        setCustomRules={setCustomRules}
                        anonymize={anonymize}
                        setAnonymize={setAnonymize}
                        onSubmit={handleAnalyze}
                        isLoading={isLoading}
                        anonymizationPreviews={anonymizationPreviews}
                    />
                    <div className="lg:sticky lg:top-8 space-y-6">
                      {isLoading && <LoadingSpinner />}
                      {error && <ErrorAlert message={error} />}
                      
                      {result && isComparisonResult(result) && (
                        <ComparisonResultDisplay result={result} onExport={handleExportComparison} />
                      )}
                      
                      {isAnalyzingSkills && (
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 text-center text-slate-500">
                           <div className="flex items-center justify-center space-x-2">
                                <div className="w-2.5 h-2.5 bg-brand-secondary rounded-full animate-pulse-fast"></div>
                                <div className="w-2.5 h-2.5 bg-brand-secondary rounded-full animate-pulse-fast [animation-delay:0.2s]"></div>
                                <div className="w-2.5 h-2.5 bg-brand-secondary rounded-full animate-pulse-fast [animation-delay:0.4s]"></div>
                            </div>
                           <p className="mt-3 text-sm font-medium text-slate-600">Analyzing applicant skill trends...</p>
                        </div>
                       )}

                      {skillsGapResult && !isAnalyzingSkills && <SkillsGapDisplay result={skillsGapResult} />}


                      {result && !isComparisonResult(result) && (
                        <div className="space-y-6">
                            <AnalysisResultDisplay
                                result={result}
                                candidateName={candidates[0]?.name || 'Candidate'}
                                onGenerateFeedback={handleGenerateFeedback}
                                isGeneratingFeedback={isGeneratingFeedback}
                                onExport={handleExportSingle}
                            />

                            {generatedFeedback && <GeneratedFeedbackDisplay feedback={generatedFeedback} />}

                            {!isFeedbackSubmitted ? (
                                <FeedbackForm
                                    rating={feedbackRating}
                                    setRating={setFeedbackRating}
                                    comments={feedbackComments}
                                    setComments={setFeedbackComments}
                                    onSubmit={handleFeedbackSubmit}
                                />
                            ) : (
                               <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <h3 className="mt-3 text-lg font-medium text-slate-800">Thank you for your feedback!</h3>
                                    <p className="mt-1 text-sm text-slate-500">Your input helps us improve the AI.</p>
                                </div>
                            )}
                        </div>
                      )}

                      {!isLoading && !error && !result && (
                        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center text-slate-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h3 className="mt-4 text-lg font-medium">IntelliHire AI Analysis</h3>
                          <p className="mt-1 text-sm">
                            Results from the AI analysis will be displayed here.
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