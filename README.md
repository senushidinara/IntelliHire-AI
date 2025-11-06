# 🧠 IntelliHire AI

> Talent selection, reimagined by intelligence — not intuition.

IntelliHire AI is a flexible tool designed to analyze a single candidate or compare multiple candidates against a provided job description and an optional marking scheme. Using the power of the Google Gemini API, it provides a detailed analysis, a match score for each candidate, and a clear summary to help you identify the best fit for a role quickly and efficiently.

This tool is built for adaptability, whether you're screening an individual applicant or comparing a group of finalists.

---

## ✨ Key Features

-   **📄 Flexible Inputs**: For every field—Job Description, Marking Scheme, and Resumes—you can either **upload a file** (`.txt`, `.md`) or **paste text directly**.
-   **➕ Dynamic Candidate Support**: Start with a single candidate and **add as many more as you need** for a comprehensive comparison.
-   **🤖 AI-Powered Analysis**: Leverages the Gemini API to perform a deep, contextual analysis for a single candidate or a side-by-side comparison for multiple candidates.
-   **📊 Clear Results**: Displays a detailed report for a single candidate or a comparative view for multiple candidates, including match scores, strengths, and weaknesses.
-   **🏆 Decisive Summary**: Provides a high-level summary from the AI explaining the candidate's fit or, in a comparison, ranking the candidates and explaining the rationale.
-   **📧 Send to Hiring Manager**: After analysis, you can click a button to generate a pre-formatted email with the complete results, ready to be sent to stakeholders.

---

## 🚀 How to Use

1.  **Provide Job Info**: Upload or paste the **Job Description**. Optionally, do the same for a **Marking Scheme**.
2.  **Provide Resumes**: For each candidate, upload or paste their resume content. Click **"Add Another Candidate"** to add more.
3.  **Analyze**: Click the **"Analyze"** or **"Compare"** button.
4.  **Review & Share**: The AI-generated results will appear on the right. Review the detailed breakdown, then click **"Send to Hiring Manager"** to easily share the report.

---

## 🛠️ Technology Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI Engine**: Google Gemini API (`gemini-2.5-flash`)
-   **Core Libraries**: `@google/genai`, `react`, `react-dom`