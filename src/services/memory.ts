import { ROOMS, TRACKED_OBJECTS, roomName } from "../data/events";
import { parseQuery } from "./queryParser";
import { dayLabel, formatTime, isToday } from "../utils/format";
import type { MemoryEvent, QueryOutcome } from "../types";

const byTimeDesc = (a: MemoryEvent, b: MemoryEvent) =>
  b.timestamp.localeCompare(a.timestamp);

function aliasesFor(objectName: string): string[] {
  const tracked = TRACKED_OBJECTS.find(
    (o) => o.name.toLowerCase() === objectName.toLowerCase()
  );
  return tracked
    ? [tracked.name.toLowerCase(), ...tracked.aliases]
    : [objectName.toLowerCase()];
}

/** Most recent event for an object — the core "last seen" lookup. */
export function findLastSeenObject(
  events: MemoryEvent[],
  objectName: string
): MemoryEvent | null {
  const names = aliasesFor(objectName);
  return (
    events
      .filter(
        (e) => e.objectName && names.includes(e.objectName.toLowerCase())
      )
      .sort(byTimeDesc)[0] ?? null
  );
}

/**
 * An object's story: its own events plus ambient room context around the
 * most recent sighting.
 */
export function getObjectHistory(
  events: MemoryEvent[],
  objectName: string
): MemoryEvent[] {
  const last = findLastSeenObject(events, objectName);
  if (!last) return [];
  const names = aliasesFor(objectName);
  return events
    .filter(
      (e) =>
        (e.objectName && names.includes(e.objectName.toLowerCase())) ||
        (e.objectName === null && e.room === last.room)
    )
    .sort(byTimeDesc);
}

export function getRecentMemories(
  events: MemoryEvent[],
  limit = 10
): MemoryEvent[] {
  return [...events].sort(byTimeDesc).slice(0, limit);
}

export interface TodayActivity {
  /** Latest event per object, newest first */
  items: MemoryEvent[];
  objectCount: number;
  eventCount: number;
}

export function getTodayObjectActivity(events: MemoryEvent[]): TodayActivity {
  const objectEvents = events.filter(
    (e) => e.objectName !== null && isToday(e.timestamp)
  );
  const latestPerObject = new Map<string, MemoryEvent>();
  for (const e of objectEvents) {
    const key = e.objectName!.toLowerCase();
    const current = latestPerObject.get(key);
    if (!current || e.timestamp > current.timestamp) {
      latestPerObject.set(key, e);
    }
  }
  return {
    items: [...latestPerObject.values()].sort(byTimeDesc),
    objectCount: latestPerObject.size,
    eventCount: objectEvents.length,
  };
}

/** Natural-language answer lines, e.g. for the hero glasses query. */
export function objectAnswerLines(event: MemoryEvent): string[] {
  const object = (event.objectName ?? "object").toLowerCase();
  const isRoomLocation = ROOMS.some(
    (r) => r.name.toLowerCase() === event.location.toLowerCase()
  );
  const preposition = isRoomLocation ? "in the" : "on the";
  const location =
    event.location.charAt(0).toLowerCase() + event.location.slice(1);
  const when = isToday(event.timestamp)
    ? formatTime(event.timestamp)
    : `${dayLabel(event.timestamp)} at ${formatTime(event.timestamp)}`;
  return [
    `NEST found your ${object}.`,
    `Last seen ${preposition} ${location} at ${when}.`,
  ];
}

const UNKNOWN_LINES = [
  "I don't have a memory for that yet.",
  "Try asking about a tracked object — for example, “Where are my glasses?”",
];

/** Map a free-text question to a demo answer, using the event database. */
export function answerQuery(events: MemoryEvent[], raw: string): QueryOutcome {
  const intent = parseQuery(raw);

  switch (intent.kind) {
    case "object": {
      const event = findLastSeenObject(events, intent.objectName);
      if (!event) {
        return {
          kind: "unknown",
          lines: [
            `I don't have a memory for your ${intent.objectName.toLowerCase()} yet.`,
            UNKNOWN_LINES[1],
          ],
        };
      }
      return {
        kind: "object",
        objectName: event.objectName!,
        event,
        lines: objectAnswerLines(event),
      };
    }

    case "activity": {
      const activity = getTodayObjectActivity(events);
      if (activity.items.length === 0) {
        return {
          kind: "activity",
          lines: ["No object activity has been remembered for today."],
          items: [],
          objectCount: 0,
          eventCount: 0,
        };
      }
      return {
        kind: "activity",
        lines: [
          "Here's what moved around your home today.",
          `${activity.objectCount} objects detected · ${activity.eventCount} events summarized into spatial memories.`,
        ],
        ...activity,
      };
    }

    case "recent": {
      const recent = getRecentMemories(events, 5);
      if (recent.length === 0) {
        return {
          kind: "recent",
          lines: ["No recent memories yet."],
          events: [],
        };
      }
      const latest = recent[0];
      const latestObject = latest.objectName
        ? latest.objectName.toLowerCase()
        : roomName(latest.room).toLowerCase();
      return {
        kind: "recent",
        lines: [
          "Here are your most recent memories.",
          `Latest: ${latestObject} ${latest.eventType.toLowerCase()} ${
            latest.location.charAt(0).toLowerCase() + latest.location.slice(1)
          } · ${formatTime(latest.timestamp)}.`,
        ],
        events: recent,
      };
    }

    default:
      return { kind: "unknown", lines: UNKNOWN_LINES };
  }
}
