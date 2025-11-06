import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, ComparisonResult } from '../types';
import { Recommendation } from '../types';

const createAIClient = (apiKey: string) => {
    if (!apiKey || apiKey.trim() === '') {
        throw new Error("API key is required to analyze resumes.");
    }
    return new GoogleGenAI({ apiKey });
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        recommendation: {
            type: Type.STRING,
            enum: [Recommendation.SELECT, Recommendation.CONSIDER, Recommendation.REJECT],
            description: "The final hiring recommendation for the candidate.",
        },
        matchScore: {
            type: Type.NUMBER,
            description: "A score from 0 to 100 representing the candidate's suitability based on the marking scheme."
        },
        summary: {
            type: Type.STRING,
            description: "A concise summary of the candidate's fit."
        },
        strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of key strengths."
        },
        weaknesses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of potential weaknesses."
        },
    },
    required: ["recommendation", "matchScore", "summary", "strengths", "weaknesses"]
};

const comparisonSchema = {
    type: Type.OBJECT,
    properties: {
        comparisonSummary: {
            type: Type.STRING,
            description: "A high-level summary comparing all candidates, explaining the final ranking and key differentiators. Start with a clear recommendation of who is the best fit."
        },
        candidateAnalyses: {
            type: Type.ARRAY,
            description: "An array containing the detailed analysis for each candidate.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The candidate's assigned name: 'Candidate 1', 'Candidate 2', etc." },
                    ...analysisSchema.properties
                },
                required: ["name", "recommendation", "matchScore", "summary", "strengths", "weaknesses"]
            }
        }
    },
    required: ["comparisonSummary", "candidateAnalyses"]
};

export const analyzeSingleResume = async (
    jobDescription: string,
    markingScheme: string,
    resume: string,
    apiKey: string
): Promise<AnalysisResult> => {
    const ai = createAIClient(apiKey);
    const prompt = `
        You are an expert Senior Hiring Manager. Your task is to analyze a candidate resume against a job description and an optional marking scheme, providing a detailed, unbiased evaluation in JSON format.

        **Job Description:**
        ---
        ${jobDescription}
        ---

        ${markingScheme.trim() ? `
        **Marking Scheme (use for detailed scoring):**
        ---
        ${markingScheme}
        ---
        ` : ''}

        **Candidate Resume**:
        ---
        ${resume}
        ---

        **Your Task**:
        1. Evaluate the candidate against the job description and the marking scheme (if provided).
        2. Create a detailed analysis for the candidate including a recommendation, match score (0-100), a brief summary, 3-5 strengths, and 2-3 weaknesses.

        Use these criteria for the recommendation:
        - **SELECT**: Excellent fit. Meets all critical requirements.
        - **CONSIDER**: Strong potential. Meets most key requirements but has manageable gaps.
        - **REJECT**: Poor fit. Fails to meet critical requirements.

        Return a single JSON object with the specified schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
                temperature: 0.2,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AnalysisResult;

    } catch (error) {
        console.error("Error calling Gemini API for single analysis:", error);
        throw new Error("Failed to get analysis from Gemini API.");
    }
};


export const compareResumes = async (
    jobDescription: string,
    markingScheme: string,
    resumes: string[]
): Promise<ComparisonResult> => {

    const candidateResumes = resumes.map((resume, index) => `
        **Candidate ${index + 1} Resume**:
        ---
        ${resume}
        ---
    `).join('\n\n');

    const prompt = `
        You are an expert Senior Hiring Manager. Your task is to compare multiple candidate resumes against a job description and an optional marking scheme, providing a detailed, unbiased evaluation in JSON format.

        **Job Description:**
        ---
        ${jobDescription}
        ---

        ${markingScheme.trim() ? `
        **Marking Scheme (use for detailed scoring):**
        ---
        ${markingScheme}
        ---
        ` : ''}

        ${candidateResumes}

        **Your Task**:
        1. Evaluate each candidate against the job description and the marking scheme (if provided).
        2. Assign "Candidate 1", "Candidate 2", etc. as the name for each respective resume.
        3. Create a detailed analysis for each candidate including a recommendation, match score (0-100), a brief summary, 3-5 strengths, and 2-3 weaknesses.
        4. Provide a final "comparisonSummary" that ranks all candidates, explains which candidate is the best fit, and why. This summary is the most important part of your analysis. Be decisive.

        Use these criteria for each candidate's recommendation:
        - **SELECT**: Excellent fit. Meets all critical requirements.
        - **CONSIDER**: Strong potential. Meets most key requirements but has manageable gaps.
        - **REJECT**: Poor fit. Fails to meet critical requirements.

        Return a single JSON object with the specified schema.
    `;

     try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: comparisonSchema,
                temperature: 0.2,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedResult = JSON.parse(jsonText) as ComparisonResult;
        
        if (parsedResult.candidateAnalyses?.length !== resumes.length) {
             throw new Error(`AI did not return analysis for all ${resumes.length} candidates.`);
        }

        return parsedResult;

    } catch (error) {
        console.error("Error calling Gemini API for comparison:", error);
        throw new Error("Failed to get comparison analysis from Gemini API.");
    }
};
