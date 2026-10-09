import {
  Activity,
  AppWindow,
  Backpack,
  Footprints,
  Glasses,
  GlassWater,
  Hand,
  KeyRound,
  Laptop,
  Move,
  PackagePlus,
  Package,
  Umbrella,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { EventType } from "../types";

export function objectIcon(objectName: string | null): LucideIcon {
  switch (objectName?.toLowerCase()) {
    case "glasses":
      return Glasses;
    case "keys":
      return KeyRound;
    case "wallet":
      return Wallet;
    case "umbrella":
      return Umbrella;
    case "laptop":
      return Laptop;
    case "water bottle":
      return GlassWater;
    case "backpack":
      return Backpack;
    default:
      return Package;
  }
}

export function eventTypeIcon(eventType: EventType): LucideIcon {
  switch (eventType) {
    case "Placed":
      return PackagePlus;
    case "Moved":
      return Move;
    case "Picked up":
      return Hand;
    case "Opened":
      return AppWindow;
    case "Entered":
      return Footprints;
    case "Active":
      return Activity;
  }
}
