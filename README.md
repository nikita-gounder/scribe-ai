# Scribe — AI Manuscript Writing Assistant

Scribe turns your analysis outputs into publication-ready manuscript sections instantly. Upload your R tables, figures, and model summaries, provide brief study context, and receive properly written Methods and Results sections in academic prose — ready to drop into your paper.

## Problem
Researchers and data analysts spend hours translating statistical outputs into written manuscript sections. The analysis is done, the results are clear, but the writing is a painful context switch that creates bottlenecks and procrastination. Scribe eliminates that bottleneck.

## Solution
Scribe accepts any combination of:
- CSV tables (summary statistics, regression outputs, demographics)
- PNG/JPG figures (ROC curves, forest plots, survival curves, any R-generated plot)
- Pasted R model output text (lm, glm, lmer, survival, ROC summaries)

Combined with a brief study context (population, outcome, journal style), Scribe generates:
- A complete Methods section describing the analytical approach in correct academic prose
- A complete Results section narrating findings with proper statistical reporting (APA/AMA/Nature format)
- A refinement panel for iterating on the output via natural language

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Google Gemini API
- Vercel (deployment)

## Core User Flow
1. Upload analysis outputs (CSV, PNG, JPG, or pasted R text) — drag and drop
2. Fill out study context form (title, population, outcome, journal style)
3. Review uploaded files and context summary
4. Click Generate — receive Methods and Results sections in seconds
5. Iterate via chat panel ("make this more concise", "add clinical interpretation", "rewrite for general audience")
6. Copy to clipboard or download as .docx

## Project Structure
scribe-ai/
├── app/
│   ├── page.tsx                  # Landing page + multi-step upload UI
│   ├── layout.tsx                # Root layout
│   ├── globals.css
│   ├── api/
│   │   ├── parse/route.ts        # File parsing endpoint
│   │   └── generate/route.ts     # AI generation endpoint
│   └── results/
│       └── page.tsx              # Generated manuscript output page
├── components/
│   ├── FileUpload.tsx            # Drag-and-drop file upload
│   ├── StudyContextForm.tsx      # Study metadata form
│   ├── ManuscriptOutput.tsx      # Rendered manuscript sections
│   └── IterationPanel.tsx        # Chat-style refinement interface
├── lib/
│   ├── parsers.ts                # File parsing logic
│   ├── prompts.ts                # AI system prompt templates
│   └── utils.ts                  # Utilities
├── types/
│   └── index.ts                  # Shared TypeScript interfaces
└── public/

## Key TypeScript Interfaces
- UploadedFile: { id, name, type: 'csv' | 'image' | 'text', rawContent, parsedContent }
- StudyContext: { title, population, primaryOutcome, statisticalMethods, journalStyle: 'APA' | 'AMA' | 'Nature' }
- ManuscriptSection: { type: 'methods' | 'results', content: string }
- IterationMessage: { role: 'user' | 'assistant', content: string }
- GenerateRequest: { files: UploadedFile[], context: StudyContext }
- GenerateResponse: { sections: ManuscriptSection[], conversationId: string }

## Environment Variables
GEMINI_API_KEY=your_key_here

## Demo Dataset
The demo uses real CSF biomarker data from an FTD (frontotemporal dementia) proteomics study — including ROC curves, regression model outputs, and demographic tables — to show Scribe working on actual clinical research outputs.

## Deployment
Deploy on Vercel:

1. Import this repository into Vercel.
2. Create a Vercel project secret named `gemini_api_key`.
3. Set the production environment variable via [vercel.json](/Users/nikita/scribe-ai/vercel.json).
4. Redeploy after updating the secret.

Live URL: [add after deployment]
