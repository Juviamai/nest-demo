import { Database, Layers, MapPin, Target } from "lucide-react";
import { useApp } from "../state/AppState";
import { MemoryTimeline } from "../components/MemoryTimeline";
import { PipelineCard } from "../components/PipelineDiagram";
import { getRecentMemories, getTodayObjectActivity } from "../services/memory";
import { isToday } from "../utils/format";
import { Card } from "../components/ui";

export function MemoryPage() {
  const { events } = useApp();
  const recent = getRecentMemories(events, 100);
  const todayEvents = events.filter((e) => isToday(e.timestamp));
  const objectEvents = todayEvents.filter((e) => e.objectName !== null);
  const activity = getTodayObjectActivity(events);
  const roomsCovered = new Set(objectEvents.map((e) => e.room)).size;
  const avgConfidence =
    objectEvents.length > 0
      ? Math.round(
          (objectEvents.reduce((sum, e) => sum + e.confidence, 0) /
            objectEvents.length) *
            100
        )
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Memory
        </h2>
        <p className="mt-0.5 text-[13.5px] text-slate-500">
          Your home's spatial memory — every event NEST remembers, and how a
          sighting becomes an answer.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={Database} label="Memories today" value={todayEvents.length} />
        <Stat icon={Layers} label="Objects tracked" value={activity.objectCount} />
        <Stat icon={MapPin} label="Rooms covered" value={roomsCovered} />
        <Stat icon={Target} label="Avg confidence" value={`${avgConfidence}%`} />
      </div>

      <PipelineCard />

      <MemoryTimeline title="Memory timeline" events={recent} />
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Database;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={14} />
        <span className="text-[11px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="mt-1.5 text-2xl font-bold tabular-nums tracking-tight text-slate-900">
        {value}
      </div>
    </Card>
  );
}
