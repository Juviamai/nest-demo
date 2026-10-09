import { X } from "lucide-react";
import { useApp } from "../state/AppState";
import { FloorPlan } from "./FloorPlan";
import { Card, Dot } from "./ui";

export function FloorPlanCard({ showSensors = false }: { showSensors?: boolean }) {
  const { marker, markerPulse, clearMarker } = useApp();

  return (
    <Card id="floorplan-card" className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-slate-900">Home floor plan</h2>
          <p className="text-[12px] text-slate-400">
            {marker
              ? `Highlighting · ${marker.location}`
              : "6 rooms · sensing equipped"}
          </p>
        </div>
        {marker && (
          <button
            onClick={clearMarker}
            aria-label="Clear highlight"
            title="Clear highlight"
            className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-600"
          >
            <X size={13} />
          </button>
        )}
      </div>

      <FloorPlan marker={marker} pulse={markerPulse} showSensors={showSensors} />

      <div className="mt-2 flex items-center gap-4 px-1 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <Dot tone="teal" />
          Last-seen location
        </span>
        {showSensors && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full border border-teal-300 bg-white" />
            Sensing device
          </span>
        )}
        <span className="ml-auto">Simulated environment</span>
      </div>
    </Card>
  );
}
