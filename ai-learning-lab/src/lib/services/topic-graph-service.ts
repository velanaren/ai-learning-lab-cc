import { prisma } from "@/lib/db/prisma";
import { generateJSON } from "@/lib/gemini/client";
import {
  createTopicGraphPrompt,
  createTopicGraphRegenerationPrompt,
  ConceptNode,
  TopicGraphData,
} from "@/lib/gemini/prompts";

// ========================================
// VALIDATION TYPES
// ========================================

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ========================================
// TOPIC GRAPH SERVICE
// ========================================

export class TopicGraphService {
  /**
   * Generate a draft Topic Graph for a given topic
   * Calls Groq API and validates the response
   */
  async generateDraftGraph(topicId: string, userId: string) {
    // 1. Fetch topic with user profile
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      throw new Error("Topic not found");
    }

    if (topic.userId !== userId) {
      throw new Error("Unauthorized: Topic does not belong to user");
    }

    // 2. Get user profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error("User profile not found. Complete questionnaire first.");
    }

    // 3. Check for existing unlocked draft
    const existingDraft = await prisma.topicGraphVersion.findFirst({
      where: {
        topicId,
        lockedByUser: false,
      },
      orderBy: { version: "desc" },
    });

    if (existingDraft) {
      return existingDraft;
    }

    // 4. Build prompt and call Gemini API
    const prompt = createTopicGraphPrompt(topic.name, topic.category, profile);

    const graphData = await generateJSON<TopicGraphData>({
      prompt,
      temperature: 0.4,
      timeoutMs: 120000, // 120 seconds for graph generation
      operationName: "Topic Graph generation",
      maxRetries: 2,
    });

    // 5. Validate graph structure
    const validation = this.validateGraphStructure(graphData.nodes);

    if (!validation.valid) {
      console.error("Graph validation failed:", validation.errors);
      throw new Error(`Invalid graph structure: ${validation.errors.join(", ")}`);
    }

    // Log warnings if any
    if (validation.warnings.length > 0) {
      console.warn("Graph validation warnings:", validation.warnings);
    }

    // 6. Get next version number
    const lastVersion = await prisma.topicGraphVersion.findFirst({
      where: { topicId },
      orderBy: { version: "desc" },
    });
    const nextVersion = (lastVersion?.version || 0) + 1;

    // 7. Save to database
    const graphVersion = await prisma.topicGraphVersion.create({
      data: {
        topicId,
        version: nextVersion,
        lockedByUser: false,
        nodesJson: graphData.nodes as unknown as object,
      },
    });

    return graphVersion;
  }

  /**
   * Regenerate a Topic Graph with user feedback
   */
  async regenerateGraph(
    topicGraphVersionId: string,
    feedback: string,
    userId: string
  ) {
    // 1. Get existing graph version
    const existingGraph = await prisma.topicGraphVersion.findUnique({
      where: { id: topicGraphVersionId },
      include: {
        topic: true,
      },
    });

    if (!existingGraph) {
      throw new Error("Topic graph version not found");
    }

    if (existingGraph.topic.userId !== userId) {
      throw new Error("Unauthorized");
    }

    if (existingGraph.lockedByUser) {
      throw new Error("Cannot regenerate a locked graph");
    }

    // 2. Get user profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error("User profile not found");
    }

    // 3. Build regeneration prompt
    const existingNodes = existingGraph.nodesJson as unknown as ConceptNode[];
    const prompt = createTopicGraphRegenerationPrompt(
      existingGraph.topic.name,
      existingNodes,
      feedback,
      profile
    );

    // 4. Call Gemini API
    const graphData = await generateJSON<TopicGraphData>({
      prompt,
      temperature: 0.5,
      timeoutMs: 120000, // 120 seconds for regeneration
      operationName: "Topic Graph regeneration",
      maxRetries: 2,
    });

    // 5. Validate
    const validation = this.validateGraphStructure(graphData.nodes);

    if (!validation.valid) {
      throw new Error(`Invalid graph structure: ${validation.errors.join(", ")}`);
    }

    // 6. Create new version (don't delete old one, for history)
    const newVersion = existingGraph.version + 1;

    const newGraphVersion = await prisma.topicGraphVersion.create({
      data: {
        topicId: existingGraph.topicId,
        version: newVersion,
        lockedByUser: false,
        nodesJson: graphData.nodes as unknown as object,
      },
    });

    return newGraphVersion;
  }

  /**
   * Validate the graph structure
   * - Check all prerequisite IDs reference existing nodes
   * - Detect cycles using DFS
   * - Verify node count (15-40)
   * - Validate required fields
   */
  validateGraphStructure(nodes: ConceptNode[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Check node count
    if (nodes.length < 15) {
      errors.push(`Too few concepts: ${nodes.length} (minimum 15)`);
    } else if (nodes.length > 40) {
      warnings.push(`Many concepts: ${nodes.length} (recommended max 40)`);
    }

    // 2. Build node ID set for reference checking
    const nodeIds = new Set(nodes.map((n) => n.id));

    // 3. Validate each node
    for (const node of nodes) {
      // Required fields
      if (!node.id) {
        errors.push("Node missing id");
        continue;
      }

      if (!node.conceptName) {
        errors.push(`Node ${node.id} missing conceptName`);
      }

      if (!node.difficulty) {
        errors.push(`Node ${node.id} missing difficulty`);
      } else if (!["beginner", "intermediate", "advanced"].includes(node.difficulty)) {
        errors.push(`Node ${node.id} has invalid difficulty: ${node.difficulty}`);
      }

      if (!node.whyItMatters) {
        warnings.push(`Node ${node.id} missing whyItMatters`);
      }

      if (!node.exampleHook) {
        warnings.push(`Node ${node.id} missing exampleHook`);
      }

      if (!node.estimatedMinutes || node.estimatedMinutes < 5 || node.estimatedMinutes > 30) {
        warnings.push(`Node ${node.id} has unusual estimatedMinutes: ${node.estimatedMinutes}`);
      }

      // Check prerequisites reference valid nodes
      if (node.prerequisites && Array.isArray(node.prerequisites)) {
        for (const prereq of node.prerequisites) {
          if (!nodeIds.has(prereq)) {
            errors.push(`Node ${node.id} references non-existent prerequisite: ${prereq}`);
          }
        }
      }
    }

    // 4. Detect cycles using DFS
    const cycleResult = this.detectCycles(nodes);
    if (cycleResult.hasCycle) {
      errors.push(`Cycle detected in prerequisites: ${cycleResult.cyclePath}`);
    }

    // 5. Check difficulty progression
    const difficultyViolations = this.checkDifficultyProgression(nodes);
    for (const violation of difficultyViolations) {
      warnings.push(violation);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Detect cycles in the prerequisite graph using DFS
   */
  private detectCycles(nodes: ConceptNode[]): { hasCycle: boolean; cyclePath?: string } {
    const nodeMap = new Map<string, ConceptNode>();
    for (const node of nodes) {
      nodeMap.set(node.id, node);
    }

    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const path: string[] = [];

    const dfs = (nodeId: string): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);
      path.push(nodeId);

      const node = nodeMap.get(nodeId);
      if (node && node.prerequisites) {
        for (const prereqId of node.prerequisites) {
          if (!visited.has(prereqId)) {
            if (dfs(prereqId)) {
              return true;
            }
          } else if (recursionStack.has(prereqId)) {
            // Cycle found
            path.push(prereqId);
            return true;
          }
        }
      }

      path.pop();
      recursionStack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (dfs(node.id)) {
          return { hasCycle: true, cyclePath: path.join(" -> ") };
        }
      }
    }

    return { hasCycle: false };
  }

  /**
   * Check that difficulty progression makes sense
   * Beginner concepts shouldn't require advanced prerequisites
   */
  private checkDifficultyProgression(nodes: ConceptNode[]): string[] {
    const violations: string[] = [];
    const nodeMap = new Map<string, ConceptNode>();

    for (const node of nodes) {
      nodeMap.set(node.id, node);
    }

    const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };

    for (const node of nodes) {
      if (node.prerequisites) {
        for (const prereqId of node.prerequisites) {
          const prereq = nodeMap.get(prereqId);
          if (prereq) {
            const nodeDiff = difficultyOrder[node.difficulty] ?? 0;
            const prereqDiff = difficultyOrder[prereq.difficulty] ?? 0;

            // Beginner requiring advanced is a violation
            if (node.difficulty === "beginner" && prereq.difficulty === "advanced") {
              violations.push(
                `Beginner concept "${node.conceptName}" requires advanced prerequisite "${prereq.conceptName}"`
              );
            }

            // Warn if there's a significant difficulty gap
            if (prereqDiff - nodeDiff > 1) {
              violations.push(
                `Concept "${node.conceptName}" (${node.difficulty}) requires "${prereq.conceptName}" (${prereq.difficulty}) - unusual progression`
              );
            }
          }
        }
      }
    }

    return violations;
  }

  /**
   * Lock a graph version making it immutable
   */
  async lockGraph(topicGraphVersionId: string, userId: string) {
    const graph = await prisma.topicGraphVersion.findUnique({
      where: { id: topicGraphVersionId },
      include: { topic: true },
    });

    if (!graph) {
      throw new Error("Graph version not found");
    }

    if (graph.topic.userId !== userId) {
      throw new Error("Unauthorized");
    }

    if (graph.lockedByUser) {
      throw new Error("Graph is already locked");
    }

    // Validate before locking
    const nodes = graph.nodesJson as unknown as ConceptNode[];
    const validation = this.validateGraphStructure(nodes);

    if (!validation.valid) {
      throw new Error(`Cannot lock invalid graph: ${validation.errors.join(", ")}`);
    }

    // Lock the graph
    const lockedGraph = await prisma.topicGraphVersion.update({
      where: { id: topicGraphVersionId },
      data: {
        lockedByUser: true,
      },
    });

    return lockedGraph;
  }

  /**
   * Topological sort of concept nodes
   * Returns nodes in order that respects prerequisites
   */
  topologicalSort(nodes: ConceptNode[]): ConceptNode[] {
    const nodeMap = new Map<string, ConceptNode>();
    const inDegree = new Map<string, number>();
    const adjacencyList = new Map<string, string[]>();

    // Initialize
    for (const node of nodes) {
      nodeMap.set(node.id, node);
      inDegree.set(node.id, 0);
      adjacencyList.set(node.id, []);
    }

    // Build graph
    for (const node of nodes) {
      if (node.prerequisites) {
        for (const prereqId of node.prerequisites) {
          const edges = adjacencyList.get(prereqId) || [];
          edges.push(node.id);
          adjacencyList.set(prereqId, edges);
          inDegree.set(node.id, (inDegree.get(node.id) || 0) + 1);
        }
      }
    }

    // Kahn's algorithm
    const queue: string[] = [];
    const result: ConceptNode[] = [];

    // Start with nodes that have no prerequisites
    for (const [nodeId, degree] of inDegree) {
      if (degree === 0) {
        queue.push(nodeId);
      }
    }

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const node = nodeMap.get(nodeId);

      if (node) {
        result.push(node);

        const neighbors = adjacencyList.get(nodeId) || [];
        for (const neighborId of neighbors) {
          const newDegree = (inDegree.get(neighborId) || 0) - 1;
          inDegree.set(neighborId, newDegree);

          if (newDegree === 0) {
            queue.push(neighborId);
          }
        }
      }
    }

    return result;
  }
}

// Export singleton instance
export const topicGraphService = new TopicGraphService();
