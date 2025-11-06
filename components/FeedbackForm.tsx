
import React from 'react';

interface FeedbackFormProps {
    rating: 'helpful' | 'unhelpful' | null;
    setRating: (rating: 'helpful' | 'unhelpful') => void;
    comments: string;
    setComments: (comments: string) => void;
    onSubmit: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
    rating,
    setRating,
    comments,
    setComments,
    onSubmit,
}) => {
    const getButtonClasses = (buttonRating: 'helpful' | 'unhelpful') => {
        const base = "inline-flex items-center justify-center rounded-full p-2 border transition-colors duration-150";
        if (rating === buttonRating) {
            return buttonRating === 'helpful' 
                ? `${base} bg-green-100 text-green-700 border-green-300`
                : `${base} bg-red-100 text-red-700 border-red-300`;
        }
        return `${base} bg-slate-100 text-slate-500 hover:bg-slate-200 border-slate-200`;
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-4 animate-fade-in">
            <h3 className="text-base font-semibold text-slate-800">Feedback</h3>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Was this analysis helpful?</label>
                <div className="flex items-center space-x-3">
                    <button 
                        type="button" 
                        onClick={() => setRating('helpful')}
                        className={getButtonClasses('helpful')}
                        aria-pressed={rating === 'helpful'}
                        title="Helpful"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333V17a1 1 0 001 1h6.758a1 1 0 00.97-1.226l-1.25-4.375a1 1 0 01.97-1.226H16.5a1.5 1.5 0 001.5-1.5v-1a1.5 1.5 0 00-1.5-1.5H16.5a1 1 0 00-1-1H8V4a1 1 0 00-1-1H6a1 1 0 00-1 1v4.333z" />
                        </svg>
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setRating('unhelpful')}
                        className={getButtonClasses('unhelpful')}
                        aria-pressed={rating === 'unhelpful'}
                        title="Not Helpful"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667V3a1 1 0 00-1-1H6.242a1 1 0 00-.97 1.226l1.25 4.375a1 1 0 01-.97 1.226H3.5a1.5 1.5 0 00-1.5 1.5v1a1.5 1.5 0 001.5 1.5H3.5a1 1 0 001 1H12v3a1 1 0 001 1h1a1 1 0 001-1V9.667z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div>
                 <label htmlFor="feedback-comments" className="block text-sm font-medium text-slate-700 mb-1">
                    Additional Comments <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <textarea
                    id="feedback-comments"
                    rows={3}
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Provide more details..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                />
            </div>
            <div className="pt-1">
                <button
                    onClick={onSubmit}
                    disabled={!rating}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                   Submit Feedback
                </button>
            </div>
        </div>
    );
};
