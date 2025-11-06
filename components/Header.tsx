import React, { useState } from 'react';

interface HeaderProps {
    apiKey: string;
    onApiKeyChange: (key: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ apiKey, onApiKeyChange }) => {
    const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);

    return (
        <header className="bg-gradient-to-r from-blue-100 via-cyan-100 to-teal-100 shadow-md border-b border-blue-200">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        <div>
                            <h1 className="text-3xl font-bold text-blue-900 tracking-tight">IntelliHire <span className="text-cyan-600">AI</span></h1>
                            <p className="text-sm text-blue-700 -mt-1">Talent selection, reimagined by intelligence — not intuition.</p>
                        </div>
                    </div>
                    <div className="text-right text-sm">
                        {apiKey && (
                            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-green-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-green-700 font-medium">API Key Connected</span>
                            </div>
                        )}
                    </div>
                </div>

                {showApiKeyInput && (
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border-2 border-blue-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex-grow">
                                <label className="block text-sm font-semibold text-blue-900 mb-2">
                                    🔑 Gemini API Key <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => onApiKeyChange(e.target.value)}
                                    placeholder="Enter your Google Gemini API key..."
                                    className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 bg-blue-50 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 text-sm transition-all duration-200"
                                />
                                <p className="text-xs text-blue-600 mt-2">
                                    Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-blue-800">Google AI Studio</a>
                                </p>
                            </div>
                            {apiKey && (
                                <button
                                    onClick={() => setShowApiKeyInput(false)}
                                    className="self-end px-4 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all duration-200 shadow-md"
                                >
                                    Done
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {!showApiKeyInput && apiKey && (
                    <button
                        onClick={() => setShowApiKeyInput(true)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                        Change API Key
                    </button>
                )}
            </div>
        </header>
    );
};
