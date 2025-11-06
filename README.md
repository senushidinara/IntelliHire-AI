<div align="center">
  <h1>🧠 IntelliHire AI</h1>
  <p><strong>Talent selection, reimagined by intelligence — not intuition.</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-19.2-blue?logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/AI-Google%20Gemini-purple?logo=google" alt="Google Gemini" />
    <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-cyan?logo=tailwindcss" alt="Tailwind CSS" />
  </p>
</div>

---

**IntelliHire AI** is an advanced, AI-powered tool engineered to streamline and elevate the recruitment process. This prototype provides a deep, unbiased analysis of a single candidate or a side-by-side comparison of multiple candidates against a job description. By leveraging the Google Gemini API, it delivers actionable insights, match scores, and decisive recommendations, empowering hiring managers to identify the best-fit talent with unparalleled speed and precision.

### 📜 Table of Contents
* [✨ Features Deep-Dive](#-features-deep-dive)
* [🚀 How It Works](#-how-it-works)
* [🏛️ System Architecture](#️-system-architecture)
* [💡 Backend & Deployment Strategy](#-backend--deployment-strategy-the-raindrop--vultr-advantage)
* [🛠️ Technology Stack & Rationale](#️-technology-stack--rationale)
* [🤖 AI Prompt Engineering: The Secret Sauce](#-ai-prompt-engineering-the-secret-sauce)
* [🔮 Future Roadmap](#-future-roadmap)

---

## ✨ Features Deep-Dive

IntelliHire AI was engineered with a focus on flexibility and power, resulting in a suite of features that adapt to any hiring workflow.

*   **📄 Dynamic Input Methods**: We recognized that convenience is key. For every required document—Job Description, Marking Scheme, and Resumes—users have the choice to either **upload a file** (like `.txt` or `.md`) with a modern drag-and-drop interface or **paste text directly**. A seamless toggle allows switching between modes at any time.

*   **📈 Scalable Candidate Analysis**: The platform was designed to handle any scenario, from a single applicant review to a large-scale finalist comparison.
    *   **Single Analysis**: Provide one resume to receive a deep, individual report.
    *   **Multi-Comparison**: Click **"Add Another Candidate"** to dynamically add more applicants. The UI and AI model adapt automatically to provide a comprehensive side-by-side comparison.

*   **🤖 Advanced AI-Powered Insights**: At its core, the application uses the Gemini API to perform a contextual analysis that goes beyond simple keyword matching.
    *   **Match Scoring**: A quantitative score (0-100) is generated for each candidate, reflecting their alignment with the job criteria.
    *   **Qualitative Breakdown**: The AI identifies and lists key **strengths** and **weaknesses** for each candidate, providing clear, actionable insights.
    *   **Decisive Summaries**: For comparisons, the AI generates a high-level summary that ranks the candidates and provides a clear, decisive recommendation on the best fit, saving hours of manual review.

*   **📧 Seamless Stakeholder Communication**: The hiring process is collaborative. Once an analysis is complete, a **"Send to Hiring Manager"** button generates a pre-formatted, detailed email in the user's default mail client, making it effortless to share the comprehensive AI-generated report with the team.

---

## 🚀 How It Works

The user experience was designed to be intuitive and linear:

1.  **Set the Criteria**: Begin by providing the **Job Description** and an optional **Marking Scheme** using either file upload or text pasting.
2.  **Input Candidates**: Add the first candidate's resume. If comparing, click **"Add Another Candidate"** to create more slots.
3.  **Initiate Analysis**: Click the smart-action button—it will read **"Analyze Candidate"** for a single resume or **"Compare Candidates"** for multiple.
4.  **Review & Share**: Within moments, the AI-generated results appear on the right. Digest the detailed breakdown and, when ready, click **"Send to Hiring Manager"** to share the findings.

---

## 🏛️ System Architecture

The architecture for IntelliHire AI was designed for scalability, low latency, and operational efficiency, leveraging a modern stack that separates the frontend from a powerful, AI-optimized backend.

<details>
<summary><strong>Click to view the Production Architectural Diagram</strong></summary>
<br>

```ascii
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
## 💡 Backend & Deployment Strategy: The Raindrop + Vultr Advantage

To achieve production-grade performance and scalability, the architecture relies on LiquidMetal AI's **Raindrop** platform deployed on **Vultr**'s high-performance cloud infrastructure. This combination provides a powerful, Claude-native environment optimized for AI workloads.

<details>
<summary><strong>Click to learn more about this strategy</strong></summary>
<br>

### Understanding the Integration

*   **Raindrop's Role**: Raindrop acts as the intelligent deployment and orchestration layer for the AI backend. It abstracts away the immense complexity of DevOps, handling deployment pipelines, auto-scaling, monitoring, and load balancing. It's the brain that makes managing a sophisticated AI infrastructure simple.
*   **Vultr's Role**: Vultr provides the raw power. Its global network of data centers and access to high-performance hardware, including cutting-edge Cloud GPUs like the AMD Instinct MI325X, supply the muscle needed for fast, efficient, and low-latency model inference.

### Conceptual Deployment Steps

1.  **Secure Vultr API Key**: First, a Vultr API key was obtained, granting the Raindrop platform programmatic access to provision and manage cloud resources.
2.  **Configure Raindrop**: Using the Raindrop CLI or dashboard, the Vultr API key was securely stored as a secret. Vultr was designated as the target cloud provider for deployment.
3.  **Define Application Needs**: The AI application's requirements (e.g., model size, container image, scaling rules, GPU type) were defined within the Raindrop platform.
4.  **Automated Provisioning**: Raindrop's orchestration engine then used the Vultr API to automatically provision the necessary resources—spinning up Cloud GPU instances, configuring networking, and setting up storage.
5.  **Deploy Model & Application**: Finally, Raindrop managed the deployment of the AI model and application code onto the newly created Vultr infrastructure, making the backend fully operational.

### Key Benefits of This Combination

*   **🚀 Efficiency for AI Workloads**: This stack was reported to achieve significant cost savings and faster time-to-market for demanding AI inference tasks.
*   ** streamlined DevOps**: Raindrop's core mission is to handle the infrastructure details, which allowed the development focus to remain on building the best AI application, not on managing servers.
*   **🌍 Global Reach & Low Latency**: Vultr's extensive network of global data centers enables the Raindrop-managed backend to be deployed close to users, ensuring a fast and responsive experience worldwide.

</details>

---

## 🛠️ Technology Stack & Rationale

The technologies were carefully selected to build a responsive, scalable, and powerful application, from the user's browser to the backend servers.

| Layer | Technology | Role | Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend** | **React 19 & TypeScript** | UI & Type Safety | Chosen for its component-based architecture and static typing, which enabled the creation of a modular, fast, and error-resistant user interface. |
| **Frontend** | **Tailwind CSS** | Styling | A utility-first framework that allowed for rapid, custom UI development with a consistent design system and full responsiveness. |
| **AI Model** | **Google Gemini** | AI Engine | The `gemini-2.5-flash` model powered the prototype, selected for its excellent balance of speed, cost, and NLU. Its native JSON mode was critical for reliable data structuring. |
| **Gateway** | **Vertex AI / FastAPI** | API Gateway & Orchestration | Designed as the robust entry point, managing request routing, authentication, and orchestrating calls to the AI models deployed via Raindrop. |
| **Backend** | **LiquidMetal Raindrop** | AI Deployment Platform | The core of the backend, chosen to abstract away DevOps complexity, providing Claude/LLM-native infrastructure and orchestrating scalable deployments on Vultr. |
| **Infra** | **Vultr Cloud** | Cloud Infrastructure | Selected for its global low-latency data centers and access to high-performance Cloud GPUs, providing the raw power needed for efficient AI model inference at scale. |


---

## 🤖 AI Prompt Engineering: The Secret Sauce

The quality of the AI's output is entirely dependent on the quality of the prompt. Significant effort was dedicated to engineering a prompt that is detailed, robust, and guides the AI to produce the desired structured output reliably.

<details>
<summary><strong>Click to view the Prompt Engineering Strategy</strong></summary>
<br>

Our prompt strategy is built on several key principles:

1.  **Persona Assignment**: The prompt begins with `You are an expert Senior Hiring Manager.` This immediately puts the AI in the correct context, priming it to use relevant vocabulary and adopt an evaluative mindset.

2.  **Clear Context & Data**: All provided data (Job Description, Marking Scheme, Resumes) is clearly delineated using Markdown and headers. This helps the AI distinguish between different pieces of source material.

3.  **Structured Task Definition**: The AI is given a numbered list of tasks, such as "Evaluate each candidate," "Assign 'Candidate 1', etc.," and "Provide a final 'comparisonSummary'." This procedural guidance ensures all required steps are completed.

4.  **Explicit Output Formatting (JSON Mode)**: This is the most critical part. We instruct the AI to `Return a single JSON object with the specified schema.` By using Gemini's `responseMimeType: "application/json"` and providing a detailed `responseSchema`, we force the model's output to conform to our exact data structure. This eliminates the need for fragile string parsing on the frontend and makes the integration robust and reliable.

5.  **Refined Logic**: We provide clear definitions for recommendation levels (`SELECT`, `CONSIDER`, `REJECT`) to standardize the AI's decision-making process. For comparisons, the prompt emphasizes that the `comparisonSummary` is the most important part, encouraging the AI to be decisive.
</details>

---

## 🔮 Future Roadmap

IntelliHire AI is a powerful tool, but the vision for it is even bigger. Potential future enhancements include:

-   [ ] **📊 Dashboard & Analytics**: Track analysis history, view trends in skill gaps across roles, and measure the quality of applicant pools over time.
-   [ ] **🔗 ATS Integration**: Connect directly with Applicant Tracking Systems (like Greenhouse or Lever) to pull candidate data automatically.
-   [ ] **🎭 Advanced Bias Detection**: Implement a secondary AI check to flag potentially biased language in job descriptions or even in the AI's own analysis.
-   [ ] **💬 Interview Question Generation**: Automatically generate a list of customized, insightful interview questions for each candidate based on their specific strengths and weaknesses.
-   [ ] **📄 PDF & DOCX Support**: Expand file support to include parsing of more complex formats like `.pdf` and `.docx`.
