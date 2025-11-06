import React, { useState, useRef } from 'react';
import type { Candidate } from '../App';

// --- Reusable FileInput Component ---
interface FileInputProps {
    onFileChange: (file: File | null) => void;
    fileName: string;
    placeholder: string;
}

const FileInput: React.FC<FileInputProps> = ({ onFileChange, fileName, placeholder }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileChange(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) onFileChange(e.target.files[0]);
    };
    const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onFileChange(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div
            className={`flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out cursor-pointer ${isDragging ? 'border-brand-primary bg-blue-50 shadow-lg' : 'border-pastel-cyan bg-gradient-to-br from-cyan-50 to-teal-50'}`}
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
        >
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept=".txt,.md,text/plain" />
            {fileName ? (
                <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    <p className="mt-3 text-base font-semibold text-teal-700 break-all">{fileName}</p>
                    <button onClick={handleRemoveFile} className="mt-3 text-sm text-red-600 hover:text-red-800 font-semibold hover:bg-red-100 px-3 py-1 rounded-lg transition-colors">Remove</button>
                </div>
            ) : (
                <div className="text-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    <p className="mt-3 text-base text-teal-700"><span className="font-semibold text-cyan-600">Click to upload</span> or drag and drop</p>
                    <p className="text-sm text-teal-600 mt-1">{placeholder}</p>
                </div>
            )}
        </div>
    );
};


// --- Reusable InputSwitcher Component ---
interface InputSwitcherProps {
    value: string;
    fileName: string;
    onChange: (data: { text?: string, file?: File | null }) => void;
    placeholderText: string;
    placeholderFile: string;
    rows?: number;
}

const InputSwitcher: React.FC<InputSwitcherProps> = ({ value, fileName, onChange, placeholderText, placeholderFile, rows = 5 }) => {
    const [inputType, setInputType] = useState<'file' | 'text'>(fileName ? 'file' : (value ? 'text' : 'file'));

    const handleFileChange = (file: File | null) => {
        onChange({ file });
        if (file) setInputType('file');
    };
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange({ text: e.target.value });
    };
    const toggleInputType = () => {
        const newType = inputType === 'file' ? 'text' : 'file';
        setInputType(newType);
        // Clear the other input type's data when switching
        if (newType === 'text') {
            onChange({ file: null });
        } else {
            onChange({ text: '' });
        }
    };

    return (
        <div>
            {inputType === 'file' ? (
                <FileInput onFileChange={handleFileChange} fileName={fileName} placeholder={placeholderFile} />
            ) : (
                <textarea
                    rows={rows}
                    className="block w-full rounded-lg border-2 border-pastel-cyan shadow-sm focus:border-brand-secondary focus:ring-2 focus:ring-cyan-300/50 text-base transition-all duration-150 ease-in-out bg-gradient-to-br from-cyan-50 to-teal-50 p-4 font-medium text-slate-700 placeholder-teal-500"
                    placeholder={placeholderText}
                    value={value}
                    onChange={handleTextChange}
                />
            )}
             <button onClick={toggleInputType} className="mt-3 text-sm text-cyan-600 hover:text-cyan-800 hover:bg-cyan-100 px-3 py-2 rounded-lg font-semibold transition-all duration-150">
                {inputType === 'file' ? '📝 Or Paste Text Instead' : '📤 Or Upload File Instead'}
            </button>
        </div>
    );
};

// --- Main ApplicationForm Component ---
interface ApplicationFormProps {
    jobDescription: string;
    jobDescriptionFileName: string;
    onJobDescriptionChange: (data: { text?: string; file?: File | null }) => void;
    markingScheme: string;
    markingSchemeFileName: string;
    onMarkingSchemeChange: (data: { text?: string; file?: File | null }) => void;
    candidates: Candidate[];
    onCandidateChange: (index: number, data: { text?: string; file?: File | null }) => void;
    onAddCandidate: () => void;
    onRemoveCandidate: (index: number) => void;
    onSubmit: () => void;
    isLoading: boolean;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
    jobDescription, jobDescriptionFileName, onJobDescriptionChange,
    markingScheme, markingSchemeFileName, onMarkingSchemeChange,
    candidates, onCandidateChange, onAddCandidate, onRemoveCandidate,
    onSubmit, isLoading,
}) => {
    const buttonText = isLoading 
        ? 'Analyzing...' 
        : candidates.length > 1 ? 'Compare Candidates' : 'Analyze Candidate';
        
    return (
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-2 border-cyan-200 space-y-8">
             <div>
                <label className="block text-lg font-bold text-teal-800 mb-3">
                    📋 Job Description <span className="text-red-500">*</span>
                </label>
                <InputSwitcher
                    value={jobDescription}
                    fileName={jobDescriptionFileName}
                    onChange={onJobDescriptionChange}
                    placeholderText="Paste the job description here..."
                    placeholderFile="Upload a .txt or .md file"
                    rows={7}
                />
            </div>
            <div>
                <label className="block text-lg font-bold text-teal-800 mb-3">
                    ⭐ Marking Scheme <span className="text-teal-500 font-normal">(Optional)</span>
                </label>
                <InputSwitcher
                    value={markingScheme}
                    fileName={markingSchemeFileName}
                    onChange={onMarkingSchemeChange}
                    placeholderText="Paste specific marking criteria here..."
                    placeholderFile="Upload a .txt or .md file"
                    rows={4}
                />
            </div>

            <div className="border-t-2 border-cyan-200 pt-6">
                <h3 className="text-lg font-bold text-teal-800 mb-4">👥 Candidate Resumes</h3>
            </div>

            <div className="space-y-5">
                {candidates.map((candidate, index) => (
                    <div key={index} className="space-y-3 p-5 bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 rounded-xl relative shadow-sm">
                        {candidates.length > 1 && (
                            <button
                                onClick={() => onRemoveCandidate(index)}
                                className="absolute top-3 right-3 p-2 text-red-400 hover:text-red-600 bg-white rounded-full hover:bg-red-100 transition-all shadow-md"
                                title="Remove Candidate"
                                aria-label="Remove Candidate"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        <label className="block text-base font-bold text-teal-800">
                            Candidate {index + 1} Resume <span className="text-red-500">*</span>
                        </label>
                        <InputSwitcher
                            value={candidate.resume}
                            fileName={candidate.fileName}
                            onChange={(data) => onCandidateChange(index, data)}
                            placeholderText={`Paste resume for Candidate ${index + 1}...`}
                            placeholderFile="Upload resume"
                            rows={8}
                        />
                    </div>
                ))}
            </div>

             <div>
                <button
                    onClick={onAddCandidate}
                    className="w-full flex justify-center items-center py-3 px-4 border-2 border-dashed border-cyan-300 rounded-xl text-base font-semibold text-teal-700 hover:bg-cyan-50 hover:border-brand-secondary hover:text-brand-secondary hover:shadow-md transition-all duration-200 bg-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    ➕ Add Another Candidate
                </button>
            </div>


            <div className="pt-4">
                <button
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-cyan-300 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200"
                >
                    {isLoading ? (
                         <>
                            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {buttonText}
                        </>
                    ) : (
                       <>🚀 {buttonText}</>
                    )}
                </button>
            </div>
        </div>
    );
};
