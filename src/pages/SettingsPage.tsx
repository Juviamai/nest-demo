import { useState } from "react";
import { Brain, Mic, Database } from "lucide-react";
import { Card } from "../components/ui";

export function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Settings
        </h2>
        <p className="mt-0.5 text-[13.5px] text-slate-500">
          Preferences for the NEST memory system.
        </p>
      </div>

      <Card className="p-5">
        <SectionTitle icon={Brain} title="Detection" />
        <div className="mt-4 space-y-4">
          <ToggleRow
            label="Object memory"
            description="Remember last-seen time and place for tracked objects."
            defaultOn
          />
          <ToggleRow
            label="Ambient events"
            description="Remember room context such as entries and activity."
            defaultOn
          />
          <ToggleRow
            label="Show confidence scores"
            description="Display detection confidence on memories."
            defaultOn
          />
        </div>
      </Card>

      <Card className="p-5">
        <SectionTitle icon={Mic} title="Voice" />
        <div className="mt-4 space-y-4">
          <ToggleRow
            label="Voice responses"
            description="Let NEST reply with spoken answers (simulated in this prototype)."
            defaultOn
          />
          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="text-[13.5px] font-semibold text-slate-800">
                Demo voice query
              </div>
              <div className="mt-0.5 text-[12.5px] text-slate-400">
                The question the simulated voice interaction asks.
              </div>
            </div>
            <input
              defaultValue="Where are my glasses?"
              className="w-64 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-700 outline-none focus:border-teal-400"
            />
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <SectionTitle icon={Database} title="Data" />
        <div className="mt-4 flex items-center justify-between gap-6">
          <div>
            <div className="text-[13.5px] font-semibold text-slate-800">
              Memory retention
            </div>
            <div className="mt-0.5 text-[12.5px] text-slate-400">
              How long NEST keeps event memories before offering cleanup.
            </div>
          </div>
          <select className="w-40 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-700 outline-none focus:border-teal-400">
            <option>7 days</option>
            <option selected>30 days</option>
            <option>90 days</option>
          </select>
        </div>
      </Card>

      <p className="px-1 text-[12px] text-slate-400">
        Settings in this prototype are illustrative — they demonstrate the
        intended product experience.
      </p>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: typeof Brain;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-50 text-slate-500">
        <Icon size={15} />
      </span>
      <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  defaultOn,
}: {
  label: string;
  description: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <div className="text-[13.5px] font-semibold text-slate-800">{label}</div>
        <div className="mt-0.5 text-[12.5px] text-slate-400">{description}</div>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn((v) => !v)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          on ? "bg-teal-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            on ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
