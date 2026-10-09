import { Camera, Droplets, Radio, Tag, Thermometer } from "lucide-react";
import { SENSORS } from "../data/sensors";
import { FloorPlanCard } from "../components/FloorPlanCard";
import { Card, Dot } from "../components/ui";
import type { SensorKind } from "../types";

const KIND_META: Record<SensorKind, { label: string; icon: typeof Camera }> = {
  camera: { label: "Camera", icon: Camera },
  motion: { label: "Motion", icon: Radio },
  temperature: { label: "Climate", icon: Thermometer },
  water: { label: "Water", icon: Droplets },
  tag: { label: "Location tag", icon: Tag },
};

export function SensorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Sensors
        </h2>
        <p className="mt-0.5 text-[13.5px] text-slate-500">
          Sensors are NEST's senses — they feed the memory layer. A smarter
          home starts with awareness.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_460px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {SENSORS.map((s) => {
            const meta = KIND_META[s.kind];
            const Icon = meta.icon;
            const online = s.status !== "offline";
            return (
              <Card key={s.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-500">
                    <Icon size={18} />
                  </div>
                  <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-500">
                    <Dot tone={online ? "emerald" : "slate"} />
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </span>
                </div>
                <div className="mt-3 text-[14.5px] font-bold text-slate-900">
                  {s.name}
                </div>
                <div className="mt-0.5 text-[12.5px] text-slate-500">
                  {s.roomName}
                </div>
                <div className="mt-2 rounded-md bg-slate-50 px-2.5 py-1.5 text-[11.5px] font-medium text-slate-400">
                  {s.detail}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="xl:sticky xl:top-6">
          <FloorPlanCard showSensors />
          <Card className="mt-4 p-4">
            <p className="text-[12.5px] leading-relaxed text-slate-500">
              In this prototype the sensing layer is simulated — devices
              generate plausible events so the memory experience can be
              demonstrated without real hardware. The cameras are shown as a
              sensing component of NEST, not as the product itself.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
