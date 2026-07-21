/**
 * Tool definitions for future agent capabilities.
 * Tools are external actions agents may invoke (APIs, file ops, etc.).
 */

export interface BrainTool {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, string>;
}

/** Placeholder catalog — extend as agents gain tool access. */
export const TOOL_CATALOG: BrainTool[] = [];

export function getTool(id: string): BrainTool | undefined {
  return TOOL_CATALOG.find((tool) => tool.id === id);
}

export function getAllTools(): BrainTool[] {
  return [...TOOL_CATALOG];
}
