import { BrainCircuit } from "lucide-react";
import { useApp } from "../state/AppState";
import { SearchHero } from "../components/SearchHero";
import { AnswerCard } from "../components/AnswerCard";
import { MemoryTimeline } from "../components/MemoryTimeline";
import { FloorPlanCard } from "../components/FloorPlanCard";
import { PipelineCard } from "../components/PipelineDiagram";
import { getRecentMemories } from "../services/memory";
import { Card } from "../components/ui";

export function HomePage() {
  const { events, outcome, queryPhase, setPage } = useApp();
  const recent = getRecentMemories(events, 5);

  return (
    <div className="space-y-6">
      <SearchHero />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-7 2xl:col-span-8">
          {queryPhase !== "thinking" && outcome && <AnswerCard />}
          {queryPhase === "idle" && !outcome && <HintCard />}

          <MemoryTimeline
            title="Recent memories"
            events={recent}
            linkLabel="View all"
            onLink={() => setPage("memory")}
          />
        </div>

        <div className="space-y-6 xl:col-span-5 2xl:col-span-4">
          <FloorPlanCard />
          <PipelineCard compact />
        </div>
      </div>
    </div>
  );
}

function HintCard() {
  return (
    <Card className="flex items-start gap-4 p-6">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600">
        <BrainCircuit size={20} />
      </div>
      <div>
        <h3 className="text-[15px] font-bold text-slate-900">
          Ask NEST about an object
        </h3>
        <p className="mt-1 text-[13.5px] leading-relaxed text-slate-500">
          NEST remembers the last seen time and place for the things you track.
          Try{" "}
          <span className="font-medium text-slate-700">
            “Where are my glasses?”
          </span>{" "}
          — or pick an object below the search box. NEST doesn't just control
          your home. It remembers it.
        </p>
      </div>
    </Card>
  );
}
