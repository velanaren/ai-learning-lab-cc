import type { UserProfile } from "@prisma/client";

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface ConceptNode {
  id: string;
  conceptName: string;
  prerequisites: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  whyItMatters: string;
  commonConfusions: string[];
  exampleHook: string;
  estimatedMinutes: number;
}

export interface TopicGraphData {
  topicName: string;
  totalConcepts: number;
  estimatedTotalHours: number;
  nodes: ConceptNode[];
}

// ========================================
// TOPIC GRAPH GENERATION PROMPT
// ========================================

export function createTopicGraphPrompt(
  topicName: string,
  topicCategory: string | null,
  profile: UserProfile
): string {
  const baselineSkills = profile.baselineSkills.length > 0
    ? profile.baselineSkills.join(", ")
    : "No prior technical skills";

  const learningGoals = profile.learningGoals.length > 0
    ? profile.learningGoals.join(", ")
    : "General understanding";

  const desiredOutcomes = profile.desiredOutcomes.length > 0
    ? profile.desiredOutcomes.join(", ")
    : "Practical usage";

  const depthLevel = profile.depthPreference === "devops-grade mastery"
    ? "comprehensive with advanced internals"
    : "practical usage with solid fundamentals";

  const priorExperience = profile.priorExperience || "Never used";

  return `You are an expert curriculum designer creating a structured learning path for "${topicName}".

LEARNER PROFILE:
- Prior Experience with ${topicName}: ${priorExperience}
- Baseline Skills: ${baselineSkills}
- Learning Goals: ${learningGoals}
- Desired Outcomes: ${desiredOutcomes}
- Depth Level: ${depthLevel}
- Daily Time Budget: ${profile.dailyMinutes || 20} minutes
- Learning Flow: ${profile.learningFlow || "concepts-first"}

TASK:
Generate a Topic Graph with 15-40 concept nodes that creates a complete learning path for ${topicName}.

THINKING PROCESS (follow these steps):
1. First, identify 5-8 CORE beginner concepts that form the foundation
2. Then, add 8-15 INTERMEDIATE concepts that build on the foundation
3. Finally, add 5-10 ADVANCED concepts for mastery (adjust based on depth preference)
4. Ensure every concept has clear prerequisites (except entry-level concepts)
5. Validate the graph is acyclic (no circular dependencies)

QUALITY CONSTRAINTS (MUST follow):
- NO generic concepts like "Introduction to ${topicName}" or "Getting Started" - be SPECIFIC
- Each concept must teach ONE atomic idea (not "X and Y")
- Prerequisites must reference specific concept IDs from earlier in the list
- Common confusions must be SPECIFIC misconceptions, not generic warnings
- Example hooks must be RUNNABLE code/config snippets under 10 lines
- Difficulty progression: beginner concepts cannot require advanced prerequisites
- Each concept: 5-15 minutes estimated time

CONCEPT NODE STRUCTURE:
{
  "id": "concept-[number]",
  "conceptName": "[Specific, atomic concept name]",
  "prerequisites": ["concept-1", "concept-2"],  // Empty array for entry concepts
  "difficulty": "beginner" | "intermediate" | "advanced",
  "whyItMatters": "[1 sentence: real-world relevance and why learner should care]",
  "commonConfusions": ["[Specific misconception 1]", "[Specific misconception 2]"],
  "exampleHook": "[Minimal runnable code/config example in markdown code block]",
  "estimatedMinutes": [5-15]
}

DIFFICULTY DISTRIBUTION GUIDELINES:
- Beginner (${priorExperience === "Never used" ? "40%" : "25%"}): Foundation concepts, no prerequisites or only other beginner concepts
- Intermediate (45%): Building blocks, require beginner concepts as prerequisites
- Advanced (${profile.depthPreference === "devops-grade mastery" ? "30%" : "15%"}): Deep dives, require intermediate concepts

RESPONSE FORMAT:
Return ONLY valid JSON (no markdown, no explanation) in this exact structure:
{
  "topicName": "${topicName}",
  "totalConcepts": [number],
  "estimatedTotalHours": [number],
  "nodes": [
    {
      "id": "concept-1",
      "conceptName": "...",
      "prerequisites": [],
      "difficulty": "beginner",
      "whyItMatters": "...",
      "commonConfusions": ["...", "..."],
      "exampleHook": "...",
      "estimatedMinutes": 10
    }
    // ... more concepts
  ]
}`;
}

// ========================================
// TOPIC GRAPH REGENERATION PROMPT
// ========================================

export function createTopicGraphRegenerationPrompt(
  topicName: string,
  existingNodes: ConceptNode[],
  userFeedback: string,
  profile: UserProfile
): string {
  const existingNodesJson = JSON.stringify(existingNodes, null, 2);

  return `You are an expert curriculum designer improving a learning path for "${topicName}".

PREVIOUS TOPIC GRAPH:
${existingNodesJson}

USER FEEDBACK:
"${userFeedback}"

LEARNER PROFILE:
- Prior Experience: ${profile.priorExperience || "Never used"}
- Learning Goals: ${profile.learningGoals.join(", ") || "General understanding"}
- Desired Outcomes: ${profile.desiredOutcomes.join(", ") || "Practical usage"}
- Depth Level: ${profile.depthPreference === "devops-grade mastery" ? "comprehensive" : "practical"}

TASK:
Regenerate the Topic Graph incorporating the user's feedback while maintaining:
- 15-40 total concepts
- Proper prerequisite ordering (acyclic graph)
- No generic or overly broad concepts
- Specific, actionable content

QUALITY CONSTRAINTS:
- Address the user's feedback directly
- Maintain topological ordering (prerequisites before dependents)
- Keep concepts atomic (one idea per concept)
- Ensure example hooks are runnable code/config

RESPONSE FORMAT:
Return ONLY valid JSON (no markdown, no explanation) with the same structure:
{
  "topicName": "${topicName}",
  "totalConcepts": [number],
  "estimatedTotalHours": [number],
  "nodes": [...]
}`;
}

// ========================================
// LEARNING CONTRACT PROMPT
// ========================================

export function createLearningContractPrompt(
  profile: UserProfile,
  topicName: string
): string {
  return `You are an expert learning designer. Based on the following learner profile, generate a clear, reflective learning contract summary.

LEARNER PROFILE:
- Role: ${profile.role || "Not specified"}
- Baseline Skills: ${profile.baselineSkills.length > 0 ? profile.baselineSkills.join(", ") : "None listed"}
- Prior Experience with ${topicName}: ${profile.priorExperience || "Never used"}
- Learning Goals: ${profile.learningGoals.length > 0 ? profile.learningGoals.join(", ") : "Not specified"}
- Desired Outcomes: ${profile.desiredOutcomes.length > 0 ? profile.desiredOutcomes.join(", ") : "Not specified"}
- Daily Time Budget: ${profile.dailyMinutes || "Not specified"} minutes
- Weekly Commitment: ${profile.weeklyHours || "Not specified"} hours
- Learning Flow Preference: ${profile.learningFlow || "Not specified"}
- Complexity Increase: ${profile.complexityIncrease || "Not specified"}
- Troubleshooting Importance: ${profile.troubleshootingPref || "Not specified"}
- Depth Philosophy: ${profile.depthPhilosophy || "Not specified"}
- Preferred Formats: ${profile.preferredFormats.length > 0 ? profile.preferredFormats.join(", ") : "Not specified"}
- Audio/Video Preference: ${profile.audioVideoPreference || "Not specified"}
- Session Style: ${profile.sessionStyle || "Not specified"}
- Content Order: ${profile.contentOrder || "Not specified"}
- Overwhelm Triggers: ${profile.overwhelmTriggers.length > 0 ? profile.overwhelmTriggers.join(", ") : "None specified"}
- Accessibility Needs: ${profile.uiToggles.length > 0 ? profile.uiToggles.join(", ") : "None"}
- Application Types: ${profile.applicationTypes.length > 0 ? profile.applicationTypes.join(", ") : "Not specified"}
- Tracking Preference: ${profile.trackingPreference || "Not specified"}
- Proof-of-Work Importance: ${profile.proofOfWorkImportance || "Not specified"}

TASK:
Generate a learning contract summary in this exact format:

## Who You Are
[2-3 sentences restating their background, role, and current skill level with ${topicName}]

## What You Want to Achieve
[2-3 sentences describing their goals and desired outcomes with ${topicName}]

## How We'll Design Your Learning Path
[3-4 bullet points explaining course design decisions:]
- Pace: [daily time budget, weekly structure]
- Depth: [simple-first vs accuracy-first, based on their philosophy]
- Structure: [concepts-first, build-first, or mixed approach]
- Application: [frequency and type of hands-on work]

## Learning Comfort Defaults
[2-3 bullet points on format, accessibility, overwhelm prevention based on their preferences]

## What We'll Emphasize
[2 bullet points on what will be prioritized based on their goals]

## What We'll Skip or Minimize
[2 bullet points on what will be de-emphasized to respect time budget and preferences]

Keep the tone warm, clear, and actionable. Use "we" language (collaborative). Make it feel like a thoughtful teacher who listened carefully. Be specific to ${topicName} where relevant.`;
}

// ========================================
// DLU (DAILY LEARNING UNIT) TYPES
// ========================================

export interface DLUConcreteExample {
  description: string;
  code: string;
  stepByStep: string[];
}

export interface DLUApplicationMoment {
  task: string;
  guidance: string;
  expectedOutput: string;
}

export interface DLUContent {
  tldrSummary?: string;
  conceptExplanation: string;
  concreteExample: DLUConcreteExample;
  reflectionPrompts: string[];
  applicationMoment: DLUApplicationMoment | null;
  nextSteps: string;
}

// ========================================
// DLU CONTENT GENERATION PROMPT
// ========================================

export function createDLUContentPrompt(
  conceptNode: ConceptNode,
  profile: UserProfile,
  prerequisitesCovered: string[],
  topicName: string
): string {
  // Determine user preferences
  const prefersTLDR = profile.contentOrder === "TL;DR → details";
  const prefersTextOnly =
    profile.audioVideoPreference === "avoid audio-video" ||
    profile.preferredFormats.includes("text-first");
  const prefersStepByStep = profile.preferredFormats.includes("step-by-step labs");
  const depthPreference =
    profile.depthPhilosophy === "never compromise on accuracy and depth"
      ? "comprehensive"
      : "concise and practical";

  const formatPreferences = profile.preferredFormats.join(", ") || "text-first";

  return `You are creating a Daily Learning Unit for the concept: "${conceptNode.conceptName}" in ${topicName}.

USER LEARNING PREFERENCES:
- Content Order: ${profile.contentOrder || "details → summary"}
- Format Preference: ${formatPreferences}
- Depth Philosophy: ${depthPreference}
- Understanding Helpers: ${profile.understandingHelpers.join(", ") || "step-by-step"}
- Session Style: ${profile.sessionStyle || "one concept per day"}
- Daily Time Budget: ${profile.dailyMinutes || 20} minutes

CONCEPT DETAILS:
- Concept Name: ${conceptNode.conceptName}
- Why It Matters: ${conceptNode.whyItMatters}
- Common Confusions: ${conceptNode.commonConfusions.join("; ")}
- Difficulty Level: ${conceptNode.difficulty}
- Example Hook: ${conceptNode.exampleHook}

PREREQUISITES ALREADY COVERED:
${prerequisitesCovered.length > 0 ? prerequisitesCovered.join(", ") : "None yet (this is an entry-level concept)"}

GENERATION TASK:
Create a complete Daily Learning Unit that respects the user's preferences and teaches this concept effectively.

OUTPUT REQUIREMENTS:

1. ${prefersTLDR ? "TL;DR Summary (REQUIRED - user prefers TL;DR first)" : "TL;DR Summary (optional)"}:
   ${prefersTLDR ? "Start with a 2-sentence summary before the detailed explanation." : "Skip or add at the end."}

2. Concept Explanation (200-400 words):
   - Explain "${conceptNode.conceptName}" clearly and concretely
   - Reference why it matters: ${conceptNode.whyItMatters}
   - Address common confusions: ${conceptNode.commonConfusions.join("; ")}
   ${prefersTextOnly ? "- Use text and ASCII diagrams only (NO video links)" : ""}
   ${profile.understandingHelpers.includes("analogies") ? "- Include a helpful real-world analogy" : ""}
   - Keep it ${depthPreference}

3. Concrete Example:
   - Provide RUNNABLE code (not pseudocode)
   - Keep under 20 lines
   - Include step-by-step explanation of what each part does
   ${prefersStepByStep ? "- Be extra detailed in the step-by-step breakdown" : ""}

4. Reflection Prompts (exactly 2):
   - Target the common confusions for this concept
   - Make them thought-provoking but quick to answer (1-2 sentences each)
   - Example format: "How would you explain [concept] to a teammate?"

5. Application Moment (5-10 minute task):
   - Provide a small, practical task the user can try
   - Include clear guidance/hints
   - Describe what success looks like (expected output)
   - Task should be completable in 5-10 minutes

6. Next Steps (1 sentence):
   - Brief preview of what concept comes next or how this connects to the bigger picture

CRITICAL: Return ONLY valid JSON. No markdown code fences. No backticks around the response.

The "code" and "expectedOutput" fields must be plain strings with \\n for newlines. Do NOT use markdown backticks inside JSON strings.

RESPONSE FORMAT (valid JSON only):
{
  ${prefersTLDR ? '"tldrSummary": "2 sentence summary here",' : ""}
  "conceptExplanation": "200-400 words explanation here",
  "concreteExample": {
    "description": "Brief description of what the example shows",
    "code": "const example = 'code';\\nconst nextLine = 'here';",
    "stepByStep": ["Step 1: explanation", "Step 2: explanation", "Step 3: explanation"]
  },
  "reflectionPrompts": [
    "Question targeting common confusion 1?",
    "Question targeting common confusion 2?"
  ],
  "applicationMoment": {
    "task": "5-10 minute practical task description",
    "guidance": "Step-by-step hints to complete the task",
    "expectedOutput": "const result = 'expected output';\\nconsole.log(result);"
  },
  "nextSteps": "1 sentence preview of what comes next"
}

Remember: All code must be a plain JSON string. Use \\n for newlines. No backticks.`;
}
