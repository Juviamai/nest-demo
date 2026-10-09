import { TRACKED_OBJECTS } from "../data/events";

export type QueryIntent =
  | { kind: "object"; objectName: string }
  | { kind: "activity" }
  | { kind: "recent" }
  | { kind: "unknown" };

/**
 * Simple keyword-based demo parser. Deliberately isolated here so a real
 * LLM/NLU can replace it later without touching the UI.
 */
export function parseQuery(raw: string): QueryIntent {
  const q = raw
    .toLowerCase()
    .replace(/[?!.,"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!q) return { kind: "unknown" };

  if (
    /(what|which).*(move|moved|moving)/.test(q) ||
    /move[d]?\s(today|around)/.test(q) ||
    /\bactivity\b/.test(q)
  ) {
    return { kind: "activity" };
  }

  if (
    /(recent|latest|show|see|view|open).*\b(memor|event|timeline)\b/.test(q) ||
    /\bmemories\b/.test(q) ||
    /memory (timeline|history)/.test(q)
  ) {
    return { kind: "recent" };
  }

  for (const obj of TRACKED_OBJECTS) {
    if (obj.aliases.some((alias) => new RegExp(`\\b${alias}\\b`).test(q))) {
      return { kind: "object", objectName: obj.name };
    }
  }

  return { kind: "unknown" };
}
