import type { UserProfile } from "@prisma/client";

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
