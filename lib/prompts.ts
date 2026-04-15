import { OUTPUT_SECTION_LABELS, StudyContext, UploadedFile } from '@/types'

export const MANUSCRIPT_SYSTEM_PROMPT = `
You are an expert writer specializing in data-driven communication. Given analysis outputs and context provided by the user, your job is to write polished analytical narrative sections.

Rules:
- Report statistics exactly as provided — never invent or extrapolate numbers
- Adapt your writing style based on the requested tone and sections
- For academic outputs, use correct statistical reporting conventions where appropriate
- For business outputs, prioritize clarity, implications, and direct language
- For technical outputs, emphasize methodological precision and implementation detail
- Flag any ambiguities with [NEEDS CLARIFICATION: specific issue]
- Do not add unsupported interpretation or claims beyond the provided evidence
- Never hallucinate statistics, sample sizes, or results not present in the inputs
- Return ONLY valid JSON. The JSON keys must exactly match the requested section names.
`

export const buildUserPrompt = (files: UploadedFile[], context: StudyContext): string => {
  const sectionInstructions = context.outputSections.map((section) => OUTPUT_SECTION_LABELS[section]).join(', ')

  const toneInstructions = {
    academic:
      'Write in formal academic prose. Use passive voice where appropriate. Report statistics in APA format: F(df) = x.xx, p = .xxx, 95% CI [x.xx, x.xx]. Use past tense.',
    business:
      'Write in clear, direct business prose. Avoid statistical jargon — explain what numbers mean in plain language. Use active voice. Lead with the so-what.',
    technical:
      'Write with technical precision. Include methodological detail. Use exact statistical values. Assume a technically literate audience.',
  }[context.outputTone]

  return `
ANALYSIS CONTEXT:
Title: ${context.title}
Dataset / Sample: ${context.population}
Key Question: ${context.primaryOutcome}
Methods Used: ${context.statisticalMethods}

OUTPUT REQUIREMENTS:
Tone: ${context.outputTone} — ${toneInstructions}
Generate these sections in order: ${sectionInstructions}

ANALYSIS OUTPUTS:
${files.map((file) => `FILE: ${file.name} (${file.type})\n${file.parsedContent}`).join('\n\n---\n\n')}

Return a JSON object where each key is the section name (snake_case) and value is the full section text. Example:
{
  "methods": "...",
  "results": "...",
  "executive_summary": "..."
}
Only include keys for the sections requested: ${context.outputSections.join(', ')}
`
}
