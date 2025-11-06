import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, CandidateInput, ComparisonResult, SkillsGapAnalysis } from '../types';
import { Recommendation } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisProperties = {
    recommendation: {
        type: Type.STRING,
        enum: [Recommendation.SELECT, Recommendation.CONSIDER, Recommendation.REJECT],
        description: "The final hiring recommendation for the candidate.",
    },
    matchScore: {
        type: Type.NUMBER,
        description: "A score from 0 to 100 representing the candidate's suitability for the role."
    },
    summary: {
        type: Type.STRING,
        description: "A concise summary of the candidate's fit for the role."
    },
    strengths: {
        type: Type.ARRAY,
        items: {
            type: Type.STRING,
            description: "A specific strength of the candidate."
        },
        description: "A list of key strengths and qualifications the candidate possesses."
    },
    weaknesses: {
        type: Type.ARRAY,
        items: {
            type: Type.STRING,
            description: "A specific weakness of the candidate."
        },
        description: "A list of potential weaknesses or areas where the candidate's experience is lacking."
    },
    yearsOfExperience: {
        type: Type.NUMBER,
        description: "The total number of years of professional experience calculated from the resume."
    },
    highestEducation: {
        type: Type.STRING,
        description: "The highest level of education mentioned in the resume (e.g., 'PhD in Computer Science', 'Bachelor of Arts')."
    },
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: analysisProperties,
    required: ["recommendation", "matchScore", "summary", "strengths", "weaknesses", "yearsOfExperience", "highestEducation"]
};

const comparisonSchema = {
    type: Type.OBJECT,
    properties: {
        comparisonSummary: {
            type: Type.STRING,
            description: "A high-level summary comparing all candidates, explaining the final ranking and key differentiators. Start with a clear ranking, e.g., '1. Candidate A, 2. Candidate B'."
        },
        candidateAnalyses: {
            type: Type.ARRAY,
            description: "An array containing the detailed analysis for each candidate.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The candidate's name as provided in the input." },
                    ...analysisProperties
                },
                required: ["name", "recommendation", "matchScore", "summary", "strengths", "weaknesses", "yearsOfExperience", "highestEducation"]
            }
        },
        keyComparisons: {
            type: Type.OBJECT,
            description: "Summaries comparing candidates on key metrics.",
            properties: {
                experience: {
                    type: Type.STRING,
                    description: "A brief summary comparing the candidates' years and types of experience."
                },
                education: {
                    type: Type.STRING,
                    description: "A brief summary comparing the candidates' educational backgrounds."
                }
            },
            required: ["experience", "education"]
        },
    },
    required: ["comparisonSummary", "candidateAnalyses", "keyComparisons"]
}

const skillsGapSchema = {
    type: Type.OBJECT,
    properties: {
        topInDemandSkills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "The top 3 most common or prominent skills found across all candidate resumes."
        },
        requiredSkills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "The key skills identified as requirements in the job description."
        },
        alignedSkills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Skills that are both required by the job and present in the applicant pool's top skills."
        },
        gapSkills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Skills required by the job but NOT commonly found in the applicant pool."
        },
        surplusSkills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Skills commonly found in the applicant pool but NOT explicitly required by the job."
        },
        analysisSummary: {
            type: Type.STRING,
            description: "A brief, insightful summary of the findings, explaining the relationship between the applicant pool's skills and the job's needs."
        }
    },
    required: ["topInDemandSkills", "requiredSkills", "alignedSkills", "gapSkills", "surplusSkills", "analysisSummary"]
};


export const analyzeSingleCandidate = async (jobDescription: string, resume: string, customRules: string, anonymize: boolean): Promise<AnalysisResult> => {
    const customRulesPromptSection = customRules.trim() ? `
        **Custom Scoring Rules:**
        ---
        ${customRules}
        ---
        Crucially, use the provided scoring rules above to heavily influence your match score and final recommendation. 'Must-have' skills are critical for the role.
    ` : '';

    const anonymizePromptSection = anonymize ? `
        **Bias & Fairness Mandate**: You MUST ignore all personally identifiable information (PII) such as name, gender, age, and ethnicity to provide a completely unbiased evaluation based purely on skills and experience.
    ` : '';

    const prompt = `
        You are an expert Senior Hiring Manager working for a company called IntelliHire AI. Your task is to analyze an applicant's resume against a job description and provide a detailed, unbiased evaluation in JSON format.
        ${anonymizePromptSection}

        **Job Description:**
        ---
        ${jobDescription}
        ---

        **Applicant's Resume:**
        ---
        ${resume}
        ---
        ${customRulesPromptSection}
        Use these criteria for your recommendation:
        - **SELECT**: Excellent fit. Meets all 'must-have' requirements (if provided) and most other requirements with minor, addressable weaknesses in non-essential areas.
        - **CONSIDER**: Strong potential. Meets most 'must-have' skills but has some noticeable, manageable gaps, perhaps in secondary skills. Weaknesses should be coachable and outweighed by significant strengths.
        - **REJECT**: Poor fit. Fails to meet multiple critical 'must-have' requirements (if provided) or other core requirements of the job.

        Provide the following in your JSON output:
        1.  **Recommendation**: "SELECT", "CONSIDER", or "REJECT".
        2.  **Match Score**: A 0-100 score on how well they match, strongly influenced by the custom scoring rules if provided.
        3.  **Summary**: A brief summary justifying your recommendation, referencing the scoring rules if they were part of the analysis.
        4.  **Strengths**: Top 3-5 strengths, prioritizing alignment with scoring rules.
        5.  **Weaknesses**: 2-3 weaknesses, clarifying their potential impact, especially concerning any missing 'must-have' skills.
        6.  **yearsOfExperience**: Total number of years of professional experience.
        7.  **highestEducation**: The highest educational degree or credential.
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
        const parsedResult = JSON.parse(jsonText) as AnalysisResult;
        
        return parsedResult;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get analysis from Gemini API.");
    }
};

export const compareCandidates = async (jobDescription: string, candidates: CandidateInput[], customRules: string, anonymize: boolean): Promise<ComparisonResult> => {
    const customRulesPromptSection = customRules.trim() ? `
        **Custom Scoring Rules:**
        ---
        ${customRules}
        ---
        Crucially, use the provided scoring rules above to heavily influence your match scores and final recommendations for ALL candidates. 'Must-have' skills are critical for the role.
    ` : '';

    const anonymizePromptSection = anonymize ? `
        **Bias & Fairness Mandate**: You MUST ignore all personally identifiable information (PII) from the resumes such as gender, age, and ethnicity to provide a completely unbiased evaluation based purely on skills and experience. Use the candidate names provided ONLY for identification in your final JSON output.
    ` : '';

    const candidatesPromptSection = candidates.map(c => `
        **Candidate Name**: ${c.name}
        **Resume**:
        ---
        ${c.resume}
        ---
    `).join('\n');

    const prompt = `
        You are an expert Senior Hiring Manager on a hiring committee for IntelliHire AI. Your task is to analyze multiple candidates against a single job description, compare them, and provide a detailed, unbiased evaluation in JSON format.

        ${anonymizePromptSection}

        **Job Description:**
        ---
        ${jobDescription}
        ---

        ${customRulesPromptSection}

        Here are the candidates:
        ${candidatesPromptSection}

        **Your Task**:
        1.  Evaluate each candidate against the job description and custom scoring rules (if provided).
        2.  Create a detailed analysis for each candidate including recommendation, score, summary, strengths, weaknesses, years of experience, and highest education.
        3.  Provide a final "comparisonSummary" that ranks the candidates and explains the key reasons for your ranking. This summary is the most important part of your analysis. Be decisive.
        4.  Provide concise comparative summaries for both experience levels and educational backgrounds in the "keyComparisons" object.

        Use these criteria for each candidate's recommendation:
        - **SELECT**: Excellent fit. Meets all 'must-have' requirements.
        - **CONSIDER**: Strong potential. Meets most 'must-have' skills but has manageable gaps.
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
        
        return parsedResult;

    } catch (error) {
        console.error("Error calling Gemini API for comparison:", error);
        throw new Error("Failed to get comparison analysis from Gemini API.");
    }
}


export const generateFeedbackForCandidate = async (jobTitle: string, analysis: AnalysisResult): Promise<string> => {
    const { recommendation, strengths, weaknesses } = analysis;

    let feedbackPromptIntro = '';
    if (recommendation === Recommendation.REJECT) {
        feedbackPromptIntro = `The candidate was not selected for this role. Your task is to write a polite, encouraging, and constructive rejection message. Focus on the identified weaknesses as areas for professional development, but frame it positively. Acknowledge their effort in applying.`;
    } else if (recommendation === Recommendation.CONSIDER) {
        feedbackPromptIntro = `The candidate is being considered and is a strong contender, but not a perfect fit. Write an encouraging message that could be used to prepare them for a follow-up interview. It should acknowledge their strengths and gently probe into the areas listed as weaknesses, framing them as topics for discussion.`;
    } else { // SELECT
        feedbackPromptIntro = `The candidate is a strong fit and will be selected to move to the next stage. Write a positive and enthusiastic message inviting them to the next step. Briefly mention 1-2 key strengths that made them stand out.`;
    }

    const prompt = `
        You are an expert and empathetic Senior Hiring Manager from IntelliHire AI, tasked with providing feedback to a candidate.
        The candidate applied for the position of: **${jobTitle}**.

        Here is a summary of their internal evaluation:
        - **Recommendation**: ${recommendation}
        - **Strengths**: ${strengths.join('; ')}
        - **Weaknesses**: ${weaknesses.join('; ')}

        **Your Task**:
        ${feedbackPromptIntro}

        Keep the tone professional, human, and supportive. Address the candidate directly (e.g., "Dear Candidate," or "Hello,"). The feedback should be a single block of text, ready to be sent. Do not include placeholders like "[Candidate Name]".
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.5,
            },
        });
        
        return response.text.trim();

    } catch (error) {
        console.error("Error calling Gemini API for feedback:", error);
        throw new Error("Failed to generate feedback from Gemini API.");
    }
};

export const analyzeSkillsGap = async (jobDescription: string, resumes: string[]): Promise<SkillsGapAnalysis> => {
    const allResumes = resumes.join('\n\n---\n\n');
    const prompt = `
        You are a strategic talent analyst for IntelliHire AI. Your task is to perform a meta-analysis on an entire applicant pool for a specific job.

        **Job Description:**
        ---
        ${jobDescription}
        ---

        **Combined Resumes of All Applicants:**
        ---
        ${allResumes}
        ---

        **Your Task**:
        1.  **Identify Top Skills in Applicant Pool**: Read through ALL resumes and identify the top 3 most common, in-demand technical skills, soft skills, or tools. These are the "topInDemandSkills".
        2.  **Identify Required Skills**: Analyze the job description and extract the most critical skills required for the role. These are the "requiredSkills".
        3.  **Compare and Categorize**:
            - Find skills present in both lists ("alignedSkills").
            - Find skills required by the job but missing from the pool's top skills ("gapSkills").
            - Find skills common in the pool but not required by the job ("surplusSkills").
        4.  **Summarize Findings**: Write a brief "analysisSummary" that provides a strategic insight into the applicant pool. For example, does the pool match the job well? Is the job description attracting people with a different skillset?

        Return a single JSON object with the specified schema. Be concise and accurate.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: skillsGapSchema,
                temperature: 0.3,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as SkillsGapAnalysis;

    } catch (error) {
        console.error("Error calling Gemini API for skills gap analysis:", error);
        throw new Error("Failed to get skills gap analysis from Gemini API.");
    }
}

export const anonymizeResume = async (resume: string): Promise<string> => {
    if (!resume.trim()) {
        return "";
    }
    const prompt = `
        You are an advanced PII (Personally Identifiable Information) redaction tool. Your sole task is to take the following resume text and replace any names, email addresses, phone numbers, and physical addresses with generic placeholders.
        - Replace names with '[NAME]'.
        - Replace emails with '[EMAIL]'.
        - Replace phone numbers with '[PHONE]'.
        - Replace physical addresses with '[ADDRESS]'.

        Do not alter, summarize, or comment on any other part of the text. Maintain the original formatting and line breaks as much as possible. Return ONLY the redacted text.

        Resume to Anonymize:
        ---
        ${resume}
        ---
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.0,
            },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API for anonymization:", error);
        return "Anonymization failed. Please try again.";
    }
};