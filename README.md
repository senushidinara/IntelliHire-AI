# 🧠 IntelliHire AI

> Talent selection, reimagined by intelligence — not intuition.

This project involved the development of IntelliHire AI, a next-generation applicant analysis platform. It was designed to leverage the Google Gemini API to evaluate, score, and shortlist candidates without human bias. The system streamlines the hiring process by providing deep, data-driven insights into a candidate's suitability for a role, comparing multiple applicants, and analyzing the overall talent pool.

The core challenge this project addressed was the time-consuming, subjective, and often biased nature of traditional resume screening. By automating the initial analysis, IntelliHire AI was built to empower hiring managers to focus on the best-fit candidates, saving time and improving the fairness of the selection process.

---

## 📋 Table of Contents
- [✨ Key Features](#-key-features)
- [🚀 How to Use](#-how-to-use)
- [🛠️ Technology Stack](#️-technology-stack)
- [🌐 System Architecture](#-system-architecture-diagram)
- [🔮 Future Work](#-future-work)

---

## ✨ Key Features

This platform was engineered with a suite of powerful features to create a comprehensive and unbiased hiring tool.

#### 📝 Single & Multi-Candidate Analysis
A dynamic analysis engine was implemented to provide maximum flexibility. It was built to seamlessly handle both the detailed evaluation of a single applicant—perfect for niche roles—and the complex, side-by-side comparison of multiple candidates, which is ideal for high-volume recruitment.

#### 📊 Advanced Side-by-Side Comparison
For multi-candidate scenarios, a dedicated comparison view was created. This interface presents a detailed, side-by-side breakdown of scores, strengths, weaknesses, experience, and education. This visual layout was designed to accelerate decision-making by placing critical data points in a directly comparable format.

#### ⭐ Visual Differentiation Engine
To make key distinctions more apparent, a "diff-like" feature was integrated into the comparison view. This system goes beyond a simple list of pros and cons by providing a relational analysis. It automatically highlights traits that are **unique (⭐)** to a single candidate or **partially shared (🔗)** among a subset of applicants, instantly flagging the key differentiators within the talent pool.

#### 🔬 Applicant Pool Skill Analysis
A meta-analysis capability was developed to provide strategic insights for talent acquisition leaders. After running a comparison, the system analyzes the top skills across all candidates and contrasts them with the job description's requirements. This generates a report on skill alignments, gaps, and surpluses, helping to answer critical questions like, "Are we attracting the right talent?"

#### ⚖️ Bias-Free Evaluation Module
To promote fair hiring practices and support Diversity, Equity, and Inclusion (DEI) goals, an anonymization feature was built. When enabled, the AI is instructed to ignore personally identifiable information (PII). A real-time preview of the redacted resume was also implemented to give users complete confidence and transparency in this process.

#### ✍️ Automated Candidate Feedback Generator
To improve the candidate experience, a feature was added to streamline communication. With a single click, the system leverages the AI to generate polite, constructive, and context-aware feedback for candidates based on their specific analysis results, saving recruiters time and strengthening the company's employer brand.

#### 📄 CSV Export Functionality
To support offline workflows and team collaboration, a CSV export function was implemented. This allows users to download detailed, well-formatted analysis reports for both single candidates and full comparisons, making it easy to share insights with stakeholders.

#### 💡 Interactive & Transparent UI
To improve usability and build user trust, the interface was enhanced with interactive tooltips and previews. These were placed on complex fields and AI-driven features to provide clear, concise explanations, demystifying the AI's process and making it an approachable tool.

---

## 🚀 How to Use

1.  **Provide Job Details**: Start by entering the **Job Title** and pasting the full **Job Description** into the designated fields.
2.  **Input Candidate Information**: Paste the resume/CV for one or more candidates. Use the **"Add another candidate"** button to expand the form for multiple applicants.
3.  **Customize the AI's Focus (Optional)**:
    -   Use the **Custom Scoring Rules** field to guide the AI's analysis by defining weighted criteria or must-have skills.
    -   Toggle the **Bias-Free Evaluation** switch to enable an anonymized review. You will see a live preview of the redacted resume.
4.  **Initiate Analysis**: Click the **"Analyze Application"** button for a single candidate or **"Compare Candidates"** for a group.
5.  **Review the Results**: The AI-generated analysis, including comparisons and the skill gap report, will be displayed on the right-hand side of the screen.
6.  **Export or Generate Feedback**: Use the buttons on the results card to download a CSV report or generate an email for the candidate.

---

## 🛠️ Technology Stack

The technology stack was chosen to ensure a modern, responsive, and powerful user experience while leveraging a state-of-the-art AI model.

-   **Frontend**:
    -   **React & TypeScript**: This combination was chosen to build a robust, type-safe, and scalable component-based user interface. TypeScript, in particular, was crucial for managing the complex data structures returned by the AI.
    -   **Tailwind CSS**: Utilized for its utility-first approach, which allowed for rapid development of a clean, responsive, and highly custom design system without leaving the component files.
-   **AI Engine**:
    -   **Google Gemini API (`gemini-2. పంచ-flash`)**: The core of the application. This powerful model was selected for its advanced reasoning, native JSON output mode, and excellent performance-to-cost ratio. The JSON mode was particularly valuable as it simplified development and reduced the risk of parsing errors, ensuring a reliable data flow.
-   **Core Libraries**:
    -   `@google/genai`: The official SDK was used for all interactions with the Gemini API, providing a stable and well-supported interface.
    -   `react` & `react-dom`: Formed the foundation of the client-side, single-page application.

---

## 🌐 System Architecture Diagram
<details>
<summary>Click to expand the System Architecture</summary>

```
                                 ┌──────────────────────────────────┐
                                 │          🌍 Users / Clients       │
                                 │(Submit data, use AI application) │
                                 └──────────────────────────────────┘
                                                   │
                                                   ▼
                      ┌──────────────────────────────────────────────────────┐
                      │           🌐 Frontend / API Gateway (Vertex AI)       │
                      │ - Manages API requests                                │
                      │ - Uses Vertex AI for model orchestration & endpoints  │
                      │ - Handles authentication & rate limiting              │
                      └──────────────────────────────────────────────────────┘
                                                   │
                                                   ▼
      ┌──────────────────────────────────────────────────────────────────────────────┐
      │                   ☁️ LiquidMetal Raindrop Platform (AI Backend Layer)         │
      │------------------------------------------------------------------------------│
      │  🔹 Abstracts DevOps complexity                                               │
      │  🔹 Manages deployment pipelines for AI/ML models                             │
      │  🔹 Handles scaling, monitoring, and load balancing                           │
      │  🔹 Integrates seamlessly with Vultr API                                      │
      │------------------------------------------------------------------------------│
      │  Components:                                                                 │
      │   - Raindrop CLI / Dashboard  (Deployment Control)                           │
      │   - Secret Manager (Vultr API keys, config)                                  │
      │   - Auto-scaler (Dynamic resource allocation)                                │
      └──────────────────────────────────────────────────────────────────────────────┘
                                                   │
                                                   ▼
                ┌─────────────────────────────────────────────────────────────┐
                │             ⚙️ Vultr Cloud Infrastructure Layer              │
                │-------------------------------------------------------------│
                │ 🔹 Provides high-performance compute (GPUs, CPUs, VMs)      │
                │ 🔹 Global data centers for low-latency inference             │
                │ 🔹 Scales dynamically per Raindrop’s orchestration           │
                │ 🔹 API integrated with Raindrop for provisioning resources   │
                │-------------------------------------------------------------│
                │  Resources Used:                                             │
                │   - Cloud GPU Instances (AMD Instinct MI325X)                │
                │   - Cloud Compute for microservices                          │
                │   - Object Storage for model/data persistence                │
                └─────────────────────────────────────────────────────────────┘
                                                   │
                                                   ▼
                              ┌──────────────────────────────────────┐
                              │     📊 Monitoring & Analytics Stack   │
                              │ (Vertex AI + Raindrop telemetry logs)│
                              │ - Real-time inference metrics         │
                              │ - Cost optimization dashboard         │
                              │ - Model performance tracking          │
                              └──────────────────────────────────────┘
                                                   │
                                                   ▼
                              ┌──────────────────────────────────────┐
                              │        🧠 AI Models (Deployed)        │
                              │ - Hosted on Vultr GPU via Raindrop   │
                              │ - Managed by Vertex AI orchestration │
                              │ - Scalable, automated, Claude-native │
                              └──────────────────────────────────────┘
```

</details>

---

## 🔮 Future Work

While the current version is a powerful proof-of-concept, several enhancements were considered for future iterations to turn it into a full-fledged enterprise solution:

-   **ATS Integration**: Connecting directly with Applicant Tracking Systems (e.g., Greenhouse, Lever) to automatically pull in candidates and push analysis results back, creating a seamless workflow.
-   **Direct File Uploads**: Implementing a robust parser to allow users to upload `.pdf` or `.docx` resume files directly, removing the need for copy-pasting.
-   **Database & User Authentication**: Adding a secure database backend (like PostgreSQL) and a user authentication system to allow for private accounts, saved analyses, and team collaboration features.
-   **Predictive Performance Analytics**: A highly advanced feature involving training a model on post-hire performance data (e.g., 6-month reviews) to see if the AI's initial recommendations correlate with long-term employee success, allowing the model to be fine-tuned over time.
-   **Advanced Dashboarding**: Creating a historical dashboard to visualize hiring trends, average match scores per role, most common skill gaps, and other key talent acquisition metrics.
