import type { UserProfile } from "@prisma/client";

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface ConceptNode {
  id: string;
  conceptName: string;
  shortDescription: string;
  prerequisites: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  whyItMatters: string;
  learningOutcome: string;
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
// DLU CONTENT TYPES
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
  hook: string;
  mentalModel: string;
  conceptExplanation: string;
  concreteExample: DLUConcreteExample;
  reflectionPrompts: string[];
  applicationMoment: DLUApplicationMoment | null;
  synthesis: string;
  nextSteps: string;
}

// ========================================
// TIME BUDGET CONFIGURATION
// ========================================

function getTimeConfig(dailyMinutes: number): {
  conceptCount: string;
  explanationLength: string;
  exampleComplexity: string;
  applicationScope: string;
  reflectionCount: number;
} {
  if (dailyMinutes <= 10) {
    return {
      conceptCount: "12-18 focused concepts",
      explanationLength: "150-200 words - punchy and essential",
      exampleComplexity: "single, minimal example (5-8 lines max)",
      applicationScope: "1-2 minute micro-task or skip",
      reflectionCount: 1,
    };
  } else if (dailyMinutes <= 20) {
    return {
      conceptCount: "18-25 concepts",
      explanationLength: "200-300 words - clear with key insights",
      exampleComplexity: "one solid example (8-12 lines)",
      applicationScope: "3-5 minute hands-on task",
      reflectionCount: 2,
    };
  } else if (dailyMinutes <= 30) {
    return {
      conceptCount: "22-32 concepts",
      explanationLength: "300-400 words - thorough coverage",
      exampleComplexity: "detailed example with variations (10-15 lines)",
      applicationScope: "5-8 minute practical exercise",
      reflectionCount: 2,
    };
  } else {
    return {
      conceptCount: "28-40 concepts with advanced depth",
      explanationLength: "400-500 words - comprehensive with edge cases",
      exampleComplexity: "multiple examples showing different scenarios (15-20 lines)",
      applicationScope: "8-12 minute mini-project",
      reflectionCount: 3,
    };
  }
}

// ========================================
// TOPIC GRAPH GENERATION PROMPT
// ========================================

export function createTopicGraphPrompt(
  topicName: string,
  topicCategory: string | null,
  profile: UserProfile
): string {
  const timeConfig = getTimeConfig(profile.dailyMinutes || 20);
  const isAbsoluteBeginner = profile.priorExperience === "Never used" || !profile.priorExperience;

  const baselineSkills = profile.baselineSkills.length > 0
    ? profile.baselineSkills.join(", ")
    : "No prior technical skills";

  const learningGoals = profile.learningGoals.length > 0
    ? profile.learningGoals.join(", ")
    : "General understanding";

  const desiredOutcomes = profile.desiredOutcomes.length > 0
    ? profile.desiredOutcomes.join(", ")
    : "Practical usage";

  return `You are a world-class curriculum designer creating a learning path for "${topicName}".

YOUR MISSION: Create a learning journey that takes someone from "${profile.priorExperience || 'Never used'}" to competent practitioner. Every concept must BUILD on what came before. No orphan ideas. No assumed knowledge.

LEARNER PROFILE:
- Prior Experience with ${topicName}: ${profile.priorExperience || "Never used (COMPLETE BEGINNER)"}
- Existing Skills: ${baselineSkills}
- Goals: ${learningGoals}
- Desired Outcomes: ${desiredOutcomes}
- Daily Time Budget: ${profile.dailyMinutes || 20} minutes
- Depth Preference: ${profile.depthPreference === "devops-grade mastery" ? "Deep mastery" : "Practical competence"}

${isAbsoluteBeginner ? `
CRITICAL - ABSOLUTE BEGINNER RULES:
This learner has NEVER used ${topicName}. Your first 4-5 concepts MUST:
1. Start with "What is ${topicName} and why does it exist?" - the PROBLEM it solves
2. Explain the mental model - how to THINK about ${topicName}
3. Cover basic terminology - define every term before using it
4. Show the simplest possible usage - "Hello World" equivalent
5. Build confidence before complexity

DO NOT assume they know:
- Any terminology specific to ${topicName}
- Why ${topicName} matters or when to use it
- How ${topicName} relates to other tools/technologies
- Any commands, syntax, or interfaces
` : `
INTERMEDIATE LEARNER RULES:
This learner has experience level: "${profile.priorExperience}". You may:
- Skip absolute basics if they've used it before
- Reference prior knowledge appropriately
- Move faster through foundational concepts
BUT still ensure each concept explicitly builds on prerequisites.
`}

TARGET: Generate ${timeConfig.conceptCount} that form a COHERENT learning path.

CONCEPT QUALITY REQUIREMENTS:

1. NAMING - Be specific and actionable:
   ❌ BAD: "Introduction to ${topicName}", "${topicName} Basics", "Getting Started with ${topicName}"
   ✅ GOOD: "The Problem ${topicName} Solves", "The ${topicName} Mental Model - How to Think About It", "Your First ${topicName} Command"

   More examples of GOOD concept names:
   - "Images vs Containers - The Blueprint and the Building"
   - "Why Your Data Disappears - Understanding Container Ephemerality"
   - "Volumes - The External Hard Drive That Survives Everything"

2. PREREQUISITES - Every non-entry concept MUST list what it builds on:
   - Entry concepts (first 3-4): prerequisites = []
   - All others: MUST reference specific concept IDs from EARLIER in the list
   - No forward references. No orphan concepts.
   - Example: "concept-8" can only reference "concept-1" through "concept-7"

3. DIFFICULTY PROGRESSION:
   - Concepts 1-5: MUST be "beginner"
   - Concepts 6-15: Mix of "beginner" and "intermediate"
   - Concepts 15+: Can include "advanced"
   - RULE: Advanced concepts can ONLY have intermediate/advanced prerequisites

4. WHY IT MATTERS - Real stakes, not fluff:
   ❌ BAD: "This is important for working with ${topicName}"
   ✅ GOOD: "Without this, your containers lose all data when they restart - your database vanishes"
   ✅ GOOD: "This is why production deployments fail silently at 3am"

5. LEARNING OUTCOMES - Specific abilities:
   ❌ BAD: "Understand volumes"
   ✅ GOOD: "Create a volume that persists your database data across container restarts"

6. EXAMPLE HOOKS - Minimal, runnable, curiosity-inducing:
   - Under 5 lines of code/commands
   - Must work in isolation
   - Should spark curiosity: "What does this actually do?"

7. COMMON CONFUSIONS - Specific misconceptions:
   ❌ BAD: "People often get confused about this"
   ✅ GOOD: "Many think RUN and CMD do the same thing - but RUN happens at BUILD time (baking the cake), CMD at START time (eating it)"

COHERENCE CHECK - Before finalizing, verify:
□ Concept 1 requires ZERO prior knowledge of ${topicName}
□ Each concept only uses terms defined in earlier concepts
□ Prerequisites form a valid DAG (no cycles, no forward references)
□ Difficulty never jumps from beginner directly to advanced
□ The path tells a STORY - there's narrative progression
□ Total concepts match the ${timeConfig.conceptCount} target

RESPONSE FORMAT:
Return ONLY valid JSON. No markdown code fences. No explanation outside JSON.

{
  "topicName": "${topicName}",
  "totalConcepts": [number between 15-40 based on time budget],
  "estimatedTotalHours": [realistic total hours],
  "nodes": [
    {
      "id": "concept-1",
      "conceptName": "The Problem ${topicName} Solves",
      "shortDescription": "One engaging sentence explaining what this concept covers and why it matters",
      "prerequisites": [],
      "difficulty": "beginner",
      "whyItMatters": "Real-world consequence or benefit - make them care",
      "learningOutcome": "After this, you'll be able to [specific measurable action]",
      "commonConfusions": ["Specific misconception 1", "Specific misconception 2"],
      "exampleHook": "minimal runnable code/command",
      "estimatedMinutes": ${Math.round((profile.dailyMinutes || 20) * 0.8)}
    },
    {
      "id": "concept-2",
      "conceptName": "The ${topicName} Mental Model",
      "shortDescription": "How to think about ${topicName} - the analogy that makes everything click",
      "prerequisites": ["concept-1"],
      "difficulty": "beginner",
      "whyItMatters": "With the right mental model, everything else becomes intuitive",
      "learningOutcome": "After this, you'll have an intuitive framework for understanding all ${topicName} concepts",
      "commonConfusions": ["Common wrong mental model 1"],
      "exampleHook": "visual or simple demonstration",
      "estimatedMinutes": ${Math.round((profile.dailyMinutes || 20) * 0.8)}
    }
  ]
}

Generate the complete graph now. Remember: coherent progression, specific names, real stakes.`;
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
  const timeConfig = getTimeConfig(profile.dailyMinutes || 20);

  return `You are improving a learning path for "${topicName}" based on user feedback.

CURRENT GRAPH:
${existingNodesJson}

USER FEEDBACK (ADDRESS THIS DIRECTLY):
"${userFeedback}"

LEARNER PROFILE:
- Prior Experience: ${profile.priorExperience || "Never used"}
- Goals: ${profile.learningGoals.join(", ") || "General understanding"}
- Daily Time: ${profile.dailyMinutes || 20} minutes

YOUR TASK:
1. ADDRESS THE FEEDBACK DIRECTLY - this is the top priority
2. Maintain coherent sequencing (prerequisites must come before dependents)
3. Target ${timeConfig.conceptCount}
4. Ensure no concept assumes knowledge that wasn't taught earlier

QUALITY REQUIREMENTS (same as original):
- Each concept builds explicitly on prerequisites (no orphans)
- Specific, actionable concept names (NOT "Introduction to X")
- Real-world "why it matters" (NOT "this is important")
- Difficulty progression: beginner → intermediate → advanced
- First 4-5 concepts MUST be beginner level for newcomers

RESPONSE FORMAT (valid JSON only, no markdown):
{
  "topicName": "${topicName}",
  "totalConcepts": [number],
  "estimatedTotalHours": [number],
  "nodes": [
    {
      "id": "concept-1",
      "conceptName": "Specific Name",
      "shortDescription": "One engaging sentence",
      "prerequisites": [],
      "difficulty": "beginner",
      "whyItMatters": "Real consequence",
      "learningOutcome": "Specific ability gained",
      "commonConfusions": ["Specific misconception"],
      "exampleHook": "minimal code",
      "estimatedMinutes": 10
    }
  ]
}`;
}

// ========================================
// LEARNING CONTRACT PROMPT
// ========================================

export function createLearningContractPrompt(
  profile: UserProfile,
  topicName: string
): string {
  return `You are crafting a learning contract that makes the learner feel SEEN and EXCITED.

This isn't a formal document. It's a promise from a mentor who genuinely understands what they want to achieve.

LEARNER PROFILE:
- Role: ${profile.role || "Not specified"}
- Baseline Skills: ${profile.baselineSkills.length > 0 ? profile.baselineSkills.join(", ") : "Starting fresh"}
- Prior Experience with ${topicName}: ${profile.priorExperience || "Never used"}
- Learning Goals: ${profile.learningGoals.length > 0 ? profile.learningGoals.join(", ") : "Master the fundamentals"}
- Desired Outcomes: ${profile.desiredOutcomes.length > 0 ? profile.desiredOutcomes.join(", ") : "Practical competence"}
- Daily Time: ${profile.dailyMinutes || "Flexible"} minutes
- Weekly Hours: ${profile.weeklyHours || "Flexible"}
- Learning Style: ${profile.learningFlow || "Balanced"}
- Preferred Formats: ${profile.preferredFormats.length > 0 ? profile.preferredFormats.join(", ") : "Mixed"}
- Overwhelm Triggers: ${profile.overwhelmTriggers.length > 0 ? profile.overwhelmTriggers.join(", ") : "None specified"}
- Depth Philosophy: ${profile.depthPhilosophy || "Balanced"}

GENERATE A LEARNING CONTRACT:

## Who You Are
[2-3 sentences reflecting their background. Make them feel understood. Be specific.]

## What You Want to Achieve
[2-3 sentences capturing their goals. Connect outcomes to real possibilities. Build excitement.]

## How We'll Design Your Learning Path
[3-4 bullet points:]
- **Pace**: [Based on their daily/weekly time - what this means practically]
- **Depth**: [Based on their philosophy - how we balance simplicity and rigor]
- **Style**: [Based on preferences - how content will be structured]
- **Application**: [How often they'll practice, what that looks like]

## Your Learning Comfort Zone
[2-3 bullet points on format preferences, accessibility, overwhelm prevention]

## What We'll Prioritize
[2 bullet points on what gets extra attention based on goals]

## What We'll Streamline
[2 bullet points on what we'll cover efficiently to respect their time]

TONE: Warm, confident, specific. Like a great coach who knows exactly how to help them succeed. Use "we" language. Encouraging but not cheesy.`;
}

// ========================================
// DLU CONTENT GENERATION PROMPT
// ========================================

export function createDLUContentPrompt(
  conceptNode: ConceptNode,
  profile: UserProfile,
  prerequisitesCovered: string[],
  topicName: string,
  dayIndex: number
): string {
  const timeConfig = getTimeConfig(profile.dailyMinutes || 20);
  const dailyMinutes = profile.dailyMinutes || 20;

  return `You are an exceptional mentor teaching "${conceptNode.conceptName}" in ${topicName}.

══════════════════════════════════════════════════════════════════════════════
                    TEACHING PHILOSOPHY (NON-NEGOTIABLE)
══════════════════════════════════════════════════════════════════════════════

You are NOT writing documentation. You are NOT creating a tutorial video script.
You are a brilliant mentor who makes complex ideas feel OBVIOUS through story and analogy.

THE GOLDEN RULE: INTUITION BEFORE SYNTAX. ALWAYS.
1. First, make them UNDERSTAND why this exists (the problem)
2. Then, give them a MENTAL MODEL they'll never forget (the analogy)
3. Only THEN show the code - and it will click instantly

This is what separates great teaching from boring documentation.

══════════════════════════════════════════════════════════════════════════════
                         EXAMPLE OF GREAT TEACHING
══════════════════════════════════════════════════════════════════════════════

Topic: Dockerfile commands (FROM, COPY, RUN, CMD)

❌ WRONG (documentation style):
"A Dockerfile consists of a series of instructions to create an image. The main commands are FROM, COPY, RUN, and CMD."

✅ RIGHT (mentor style):
"The Dockerfile. Think of it as a recipe card. But a very special kind of recipe.

In a normal kitchen, if the recipe says 'add sugar' and you have no sugar, the cake fails.
In the Docker world, the recipe INCLUDES the kitchen, the chef, the sugar, and the bowl.
It brings its own universe.

Let's look at the four commands that make up 90% of any Dockerfile. Ready?

First: FROM. Every great invention stands on the shoulders of giants.
You don't write an operating system from scratch. You say:
  FROM python:3.9-slim
This tells Docker: 'Start with a pre-existing image that already has Linux and Python.'
You just declare your starting point.

Next: COPY. This is the transporter beam.
It takes files from your physical machine and beams them inside the container's file system.
  COPY . /app
Simple. You're moving matter from your world into the container's world.

Here's where people get confused: RUN.
  RUN pip install -r requirements.txt
Critical insight: RUN happens at BUILD time. It's like baking a cake.
You mix the ingredients, put it in the oven. Once done, the result is FROZEN.
It's a snapshot. Not running anymore - it's done.

And finally: CMD. The spark of life.
This does NOT happen when you build. It happens when you START the container.
  CMD [\\"python\\", \\"app.py\\"]
If this process dies, the container dies. They're linked.

So remember: FROM is your foundation, COPY beams in your code, RUN bakes it together, and CMD is the spark that brings it to life.

Let's go write one."

Notice:
- Mental model FIRST (recipe that includes the kitchen)
- Each command gets its MOMENT with its own analogy
- Addresses confusion explicitly ("here's where people get confused")
- Conversational markers ("Ready?", "Let's go write one")
- Synthesis at the end ties it together

══════════════════════════════════════════════════════════════════════════════
                           YOUR TASK TODAY
══════════════════════════════════════════════════════════════════════════════

CONCEPT TO TEACH:
- Name: ${conceptNode.conceptName}
- Why It Matters: ${conceptNode.whyItMatters}
- Common Confusions: ${conceptNode.commonConfusions.join("; ")}
- Difficulty: ${conceptNode.difficulty}
- Day ${dayIndex + 1} of the learning journey

PREREQUISITES THEY'VE COMPLETED:
${prerequisitesCovered.length > 0
  ? prerequisitesCovered.join(", ")
  : "None yet - this is their FIRST concept. Assume ZERO knowledge of " + topicName}

LEARNER PREFERENCES:
- Time Budget: ${dailyMinutes} minutes (calibrate content length!)
- Depth: ${profile.depthPhilosophy === "never compromise on accuracy and depth" ? "thorough" : "practical"}
- Helpers they want: ${profile.understandingHelpers?.join(", ") || "analogies, examples"}

CONTENT CALIBRATION FOR ${dailyMinutes} MINUTES:
- Explanation: ${timeConfig.explanationLength}
- Example: ${timeConfig.exampleComplexity}
- Application: ${timeConfig.applicationScope}
- Reflections: ${timeConfig.reflectionCount}

══════════════════════════════════════════════════════════════════════════════
                         REQUIRED STRUCTURE
══════════════════════════════════════════════════════════════════════════════

1. HOOK (2-3 sentences)
   Create curiosity. Make them NEED to understand this.
   Examples: "Here's something that trips up 90% of beginners..."
             "Imagine building something amazing, then losing it all because..."

2. MENTAL MODEL (1-2 short paragraphs)
   The vivid analogy that makes everything click.
   - Must be tangible (physical objects, real situations)
   - Must be memorable (they'll picture it when they see code)
   - Must be accurate (won't mislead as they learn more)

3. CONCEPT EXPLANATION (${timeConfig.explanationLength})
   Build understanding step by step.
   - Reference your mental model throughout
   - Address the common confusions explicitly
   - Use conversational markers ("Here's the key insight...", "Now watch what happens...")
   - Each sub-idea gets its moment before moving on

4. CONCRETE EXAMPLE
   - ${timeConfig.exampleComplexity}
   - Step-by-step breakdown of WHAT each part does and WHY
   - Code must be runnable in isolation

5. REFLECTION PROMPTS (${timeConfig.reflectionCount})
   Make them THINK, not just recall.
   ❌ "What does X do?"
   ✅ "If someone asked 'why not just do Y instead?', what would you tell them?"

6. APPLICATION MOMENT (${timeConfig.applicationScope})
   ${dailyMinutes <= 10 ? "Brief micro-task or null if concept is theoretical" : "Hands-on task with clear instructions and expected output"}

7. SYNTHESIS (2-3 sentences)
   Tie it together. Reinforce the mental model.
   "So remember: [callback to mental model]"

8. NEXT STEPS (1 sentence)
   Build momentum for tomorrow.

══════════════════════════════════════════════════════════════════════════════
                            OUTPUT FORMAT
══════════════════════════════════════════════════════════════════════════════

Return ONLY valid JSON. No markdown fences. No backticks around response.
Code in JSON must use \\n for newlines.

{
  "hook": "2-3 sentence curiosity gap that makes them need to know",
  "mentalModel": "The vivid analogy - 1-2 paragraphs that create intuition",
  "conceptExplanation": "Main teaching - ${timeConfig.explanationLength}. Reference mental model. Address confusions. Conversational style.",
  "concreteExample": {
    "description": "What this example demonstrates",
    "code": "runnable code here\\nuse \\\\n for newlines",
    "stepByStep": ["Step 1: what and WHY", "Step 2: what and WHY"]
  },
  "reflectionPrompts": ["Thought-provoking question 1", "Question 2 if ${timeConfig.reflectionCount} > 1"],
  "applicationMoment": ${dailyMinutes <= 10 ? "null" : `{
    "task": "Clear hands-on task",
    "guidance": "Step-by-step hints",
    "expectedOutput": "What success looks like"
  }`},
  "synthesis": "2-3 sentences tying it together with mental model callback",
  "nextSteps": "1 exciting sentence about tomorrow"
}

Now teach "${conceptNode.conceptName}" like the brilliant mentor you are.`;
}

// ========================================
// WEEKLY REVIEW TYPES
// ========================================

export interface WeekData {
  totalDays: number;
  completedDays: number;
  skippedDays: number[];
  appliedDays: number;
  conceptsCovered: string[];
  averageReflectionLength: number;
  confusionSignals: string[];
}

export interface WeeklyReviewInsights {
  pacing: string;
  application: string;
  engagement: string;
}

export interface AdjustmentSuggestion {
  type: "pace_down" | "pace_up" | "more_application" | "smaller_chunks" | "none";
  reason: string;
  description: string;
}

export interface WeeklyReviewData {
  progressSummary: string;
  insights: WeeklyReviewInsights;
  adjustmentSuggestion: AdjustmentSuggestion;
  nextWeekPreview: string;
  weekData: WeekData;
}

// ========================================
// WEEKLY REVIEW GENERATION PROMPT
// ========================================

export function createWeeklyReviewPrompt(
  weekData: WeekData,
  topicName: string,
  dailyMinutes: number | null
): string {
  const completionRate = Math.round((weekData.completedDays / weekData.totalDays) * 100);
  const applicationRate = weekData.completedDays > 0
    ? Math.round((weekData.appliedDays / weekData.completedDays) * 100)
    : 0;

  return `You are analyzing a learner's weekly progress in "${topicName}" and generating a personalized review.

══════════════════════════════════════════════════════════════════════════════
                              WEEK DATA
══════════════════════════════════════════════════════════════════════════════

COMPLETION:
- Total days in week: ${weekData.totalDays}
- Days completed: ${weekData.completedDays} (${completionRate}%)
- Days skipped: ${weekData.skippedDays.length > 0 ? weekData.skippedDays.join(", ") : "None"}

APPLICATION:
- Days with hands-on application: ${weekData.appliedDays} (${applicationRate}% of completed days)

CONCEPTS COVERED:
${weekData.conceptsCovered.length > 0 ? weekData.conceptsCovered.map((c, i) => `${i + 1}. ${c}`).join("\n") : "No concepts completed this week"}

ENGAGEMENT SIGNALS:
- Average reflection length: ${weekData.averageReflectionLength} characters
- Confusion signals detected: ${weekData.confusionSignals.length > 0 ? weekData.confusionSignals.join(", ") : "None"}

LEARNER SETUP:
- Daily time budget: ${dailyMinutes || 20} minutes

══════════════════════════════════════════════════════════════════════════════
                            YOUR TASK
══════════════════════════════════════════════════════════════════════════════

Generate a supportive, personalized weekly review that:
1. Celebrates what was accomplished (be specific!)
2. Provides honest but encouraging insights
3. Suggests ONE adjustment if needed (or "none" if things are going well)
4. Builds anticipation for next week

TONE: Like a supportive coach reviewing game film with an athlete. Honest, specific, encouraging.

ADJUSTMENT LOGIC:
- If completion < 50%: Consider "pace_down" (fewer concepts, more digestible)
- If completion good but application < 30%: Consider "more_application"
- If confusion signals > 2: Consider "smaller_chunks" (break down concepts more)
- If completion > 80% and application > 60%: Consider "pace_up" or "none"
- Default to "none" if learner is doing well

══════════════════════════════════════════════════════════════════════════════
                            OUTPUT FORMAT
══════════════════════════════════════════════════════════════════════════════

Return ONLY valid JSON. No markdown fences.

{
  "progressSummary": "2-3 sentences on what was accomplished this week. Be specific about concepts learned. Celebrate wins!",
  "insights": {
    "pacing": "1-2 sentences on how the learner is keeping up with the pace. Specific observation.",
    "application": "1-2 sentences on hands-on practice. What they're doing well or could do more.",
    "engagement": "1-2 sentences on engagement quality based on reflection depth and signals."
  },
  "adjustmentSuggestion": {
    "type": "pace_down" | "pace_up" | "more_application" | "smaller_chunks" | "none",
    "reason": "Why this adjustment is suggested (or why no adjustment needed). Be specific.",
    "description": "What will change if applied (e.g., 'We'll cover fewer concepts per day to give you more time to absorb each one')"
  },
  "nextWeekPreview": "1 exciting sentence about what's coming up next week"
}

Generate the weekly review now.`;
}
