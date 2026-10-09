export type RoomId =
  | "bedroom"
  | "study"
  | "living-room"
  | "kitchen"
  | "bathroom"
  | "entryway"
  | "hall";

export interface RoomInfo {
  id: RoomId;
  name: string;
}

export type EventType =
  | "Placed"
  | "Moved"
  | "Picked up"
  | "Opened"
  | "Entered"
  | "Active";

/**
 * A compact memory record. NEST stores events like this instead of footage:
 * "Remember the event — not the footage."
 */
export interface MemoryEvent {
  id: string;
  /** null for ambient room events (person entered, area active, ...) */
  objectName: string | null;
  eventType: EventType;
  /** Fine-grained location, e.g. "Bedroom desk" */
  location: string;
  room: RoomId;
  /** ISO timestamp */
  timestamp: string;
  /** 0..1 */
  confidence: number;
  /** Which sensing device produced this memory */
  source: string;
  memoryType: "Spatial" | "Ambient";
  description: string;
}

export interface TrackedObject {
  name: string;
  aliases: string[];
}

export type SensorKind =
  | "camera"
  | "motion"
  | "temperature"
  | "water"
  | "tag";

export interface Sensor {
  id: string;
  kind: SensorKind;
  name: string;
  room: RoomId;
  roomName: string;
  status: "online" | "connected" | "offline";
  detail: string;
  /** Position on the floor plan SVG (viewBox 1000 x 660) */
  x: number;
  y: number;
}

/** What is currently highlighted on the floor plan */
export interface MarkerInfo {
  location: string;
  room: RoomId;
  objectName: string | null;
  timeLabel: string;
  label: string;
}

export type QueryOutcome =
  | { kind: "object"; objectName: string; event: MemoryEvent; lines: string[] }
  | {
      kind: "activity";
      lines: string[];
      items: MemoryEvent[];
      objectCount: number;
      eventCount: number;
    }
  | { kind: "recent"; lines: string[]; events: MemoryEvent[] }
  | { kind: "unknown"; lines: string[] };
