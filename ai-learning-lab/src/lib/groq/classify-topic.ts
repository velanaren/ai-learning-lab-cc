import { groq, MODELS, callGroqWithRetry } from "./client";
import {
  TopicCategory,
  TOPIC_CATEGORIES,
  getAllCategoryNames,
} from "@/lib/config/topic-categories";

interface ClassificationResult {
  category: TopicCategory;
  confidence: number;
}

/**
 * Classify a topic into one of the predefined categories using Groq AI.
 * Returns the category and confidence score.
 */
export async function classifyTopic(
  topicName: string
): Promise<ClassificationResult> {
  const categories = getAllCategoryNames();

  // Build category descriptions for the prompt
  const categoryDescriptions = categories
    .map((cat) => {
      const config = TOPIC_CATEGORIES[cat as TopicCategory];
      const keywords = config.keywords.slice(0, 10).join(", ");
      return `- ${cat}: ${config.name} (e.g., ${keywords || "general topics"})`;
    })
    .join("\n");

  const prompt = `You are a topic classification assistant. Classify the given learning topic into exactly ONE of these categories.

CATEGORIES:
${categoryDescriptions}

TOPIC TO CLASSIFY: "${topicName}"

Respond with ONLY a JSON object in this exact format (no markdown, no explanation):
{"category": "category_name", "confidence": 0.95}

Rules:
1. Choose the single most appropriate category
2. Confidence should be between 0.5 and 1.0
3. If unsure, use "general" category with lower confidence
4. Category must be one of: ${categories.join(", ")}`;

  try {
    const response = await callGroqWithRetry(async () => {
      const completion = await groq.chat.completions.create({
        model: MODELS.fast, // Use fast model for quick classification
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1, // Low temperature for consistent results
        max_tokens: 100,
      });

      return completion.choices[0]?.message?.content || "";
    });

    // Parse the JSON response
    const cleanedResponse = response.trim().replace(/```json\n?|```\n?/g, "");
    const result = JSON.parse(cleanedResponse) as ClassificationResult;

    // Validate the category
    if (!categories.includes(result.category)) {
      console.warn(
        `Invalid category "${result.category}" returned, defaulting to general`
      );
      return { category: "general", confidence: 0.5 };
    }

    // Ensure confidence is within bounds
    result.confidence = Math.max(0.5, Math.min(1.0, result.confidence));

    return result;
  } catch (error) {
    console.error("Error classifying topic:", error);
    // Default to general category on error
    return { category: "general", confidence: 0.5 };
  }
}

/**
 * Try to match topic using keywords first (faster, no API call).
 * Falls back to AI classification if no keyword match found.
 */
export async function classifyTopicWithFallback(
  topicName: string
): Promise<ClassificationResult> {
  const normalizedTopic = topicName.toLowerCase().trim();

  // First, try keyword matching
  for (const [category, config] of Object.entries(TOPIC_CATEGORIES)) {
    for (const keyword of config.keywords) {
      if (
        normalizedTopic.includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(normalizedTopic)
      ) {
        return {
          category: category as TopicCategory,
          confidence: 0.9,
        };
      }
    }
  }

  // No keyword match, use AI classification
  return classifyTopic(topicName);
}
