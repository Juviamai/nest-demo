import { motion } from "framer-motion";
import { Camera, Droplets, Radio, Tag, Thermometer } from "lucide-react";
import { SENSORS } from "../data/sensors";
import { roomName } from "../data/events";
import type { MarkerInfo, RoomId, SensorKind } from "../types";

const ROOM_RECTS: Record<
  RoomId,
  { x: number; y: number; w: number; h: number; label: { x: number; y: number }; center: { x: number; y: number } }
> = {
  bedroom: { x: 12, y: 12, w: 368, h: 358, label: { x: 28, y: 38 }, center: { x: 196, y: 191 } },
  study: { x: 380, y: 12, w: 320, h: 358, label: { x: 396, y: 38 }, center: { x: 540, y: 191 } },
  bathroom: { x: 700, y: 12, w: 290, h: 178, label: { x: 716, y: 38 }, center: { x: 845, y: 101 } },
  hall: { x: 700, y: 190, w: 290, h: 180, label: { x: 716, y: 216 }, center: { x: 845, y: 280 } },
  "living-room": { x: 12, y: 370, w: 548, h: 278, label: { x: 28, y: 398 }, center: { x: 286, y: 509 } },
  kitchen: { x: 560, y: 370, w: 250, h: 278, label: { x: 576, y: 446 }, center: { x: 685, y: 509 } },
  entryway: { x: 810, y: 370, w: 180, h: 278, label: { x: 826, y: 398 }, center: { x: 900, y: 509 } },
};

const LOCATION_POINTS: Record<string, { x: number; y: number }> = {
  "Bedroom desk": { x: 290, y: 323 },
  "Bedroom chair": { x: 175, y: 283 },
  "Bedroom nightstand": { x: 208, y: 74 },
  "Study desk": { x: 528, y: 76 },
  "Living room sofa": { x: 305, y: 588 },
  "Kitchen counter": { x: 690, y: 400 },
  "Entry table": { x: 956, y: 495 },
  Entryway: { x: 928, y: 598 },
};

/** Where the animated route starts — the front door. */
const ROUTE_START = { x: 906, y: 618 };

function locationPoint(location: string, room: RoomId) {
  return LOCATION_POINTS[location] ?? ROOM_RECTS[room].center;
}

const ROOM_IDS = Object.keys(ROOM_RECTS) as RoomId[];

const FURNITURE_FILL = "#E7EEF2";
const FURNITRE_STROKE = "#BCCBD6";
const SOFT_FILL = "#F0F5F8";
const WALL = "#9FB2BF";
const DOOR_ARC = "#C3D2DA";

export function FloorPlan({
  marker,
  pulse,
  showSensors = false,
}: {
  marker?: MarkerInfo | null;
  pulse?: number;
  showSensors?: boolean;
}) {
  const activeRoom: RoomId | null = marker?.room ?? null;
  const point = marker ? locationPoint(marker.location, marker.room) : null;
  // Keep the tooltip inside the card near the right edge.
  const tooltipX = point ? Math.min(Math.max(point.x, 105), 895) : 0;

  const routeD = point
    ? `M ${ROUTE_START.x} ${ROUTE_START.y} L ${point.x} ${ROUTE_START.y} L ${point.x} ${point.y}`
    : null;

  return (
    <div className="relative w-full" style={{ aspectRatio: "1000 / 660" }}>
      <svg
        viewBox="0 0 1000 660"
        className="h-full w-full"
        role="img"
        aria-label="Home floor plan"
      >
        {/* Rooms */}
        {ROOM_IDS.map((id) => {
          const r = ROOM_RECTS[id];
          const dim = activeRoom !== null && id !== activeRoom;
          return (
            <g
              key={id}
              style={{
                opacity: dim ? 0.42 : 1,
                filter: dim ? "grayscale(65%)" : undefined,
                transition: "opacity 0.5s ease, filter 0.5s ease",
              }}
            >
              <rect
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                fill="#F6F9FB"
                stroke="#DCE6EC"
                strokeWidth={1.5}
              />
              {id === activeRoom && (
                <rect
                  x={r.x}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  fill="#0D9488"
                  opacity={0.08}
                />
              )}
            </g>
          );
        })}

        {/* Furniture */}
        <g
          style={{
            opacity: 1,
            transition: "opacity 0.5s ease",
          }}
          pointerEvents="none"
        >
          {Furniture()}
        </g>

        {/* Room labels */}
        <g pointerEvents="none">
          {ROOM_IDS.map((id) => {
            const r = ROOM_RECTS[id];
            const active = id === activeRoom;
            return (
              <text
                key={id}
                x={r.label.x}
                y={r.label.y}
                fontSize={13.5}
                fontWeight={600}
                letterSpacing={2}
                fill={active ? "#0F766E" : "#7E95A6"}
                style={{ transition: "fill 0.5s ease" }}
              >
                {roomName(id).toUpperCase()}
              </text>
            );
          })}
        </g>

        {/* Walls */}
        <g stroke={WALL} strokeWidth={4.5} strokeLinecap="round" fill="none" pointerEvents="none">
          <path d="M862,648 H12 V12 H988 V648" />
          <path d="M950,648 H988" />
          <line x1={380} y1={12} x2={380} y2={370} />
          <line x1={700} y1={12} x2={700} y2={240} />
          <line x1={700} y1={295} x2={700} y2={370} />
          <line x1={700} y1={190} x2={815} y2={190} />
          <line x1={870} y1={190} x2={988} y2={190} />
          <line x1={12} y1={370} x2={235} y2={370} />
          <line x1={290} y1={370} x2={470} y2={370} />
          <line x1={525} y1={370} x2={795} y2={370} />
          <line x1={855} y1={370} x2={988} y2={370} />
          <line x1={560} y1={370} x2={560} y2={470} />
          <line x1={560} y1={525} x2={560} y2={648} />
          <line x1={810} y1={370} x2={810} y2={425} />
          <line x1={810} y1={480} x2={810} y2={648} />
        </g>

        {/* Door leaves + swing arcs */}
        <g fill="none" pointerEvents="none">
          <g stroke={WALL} strokeWidth={3} strokeLinecap="round">
            <path d="M235,370 L235,315" />
            <path d="M470,370 L470,315" />
            <path d="M795,370 L795,310" />
            <path d="M815,190 L815,135" />
            <path d="M560,470 L615,470" />
            <path d="M810,425 L865,425" />
            <path d="M700,240 L645,240" />
            <path d="M950,648 L950,560" />
          </g>
          <g stroke={DOOR_ARC} strokeWidth={1.5}>
            <path d="M235,315 A55,55 0 0 1 290,370" />
            <path d="M470,315 A55,55 0 0 1 525,370" />
            <path d="M795,310 A60,60 0 0 1 855,370" />
            <path d="M815,135 A55,55 0 0 1 870,190" />
            <path d="M615,470 A55,55 0 0 1 560,525" />
            <path d="M865,425 A55,55 0 0 1 810,480" />
            <path d="M645,240 A55,55 0 0 0 700,295" />
            <path d="M950,560 A88,88 0 0 0 862,648" />
          </g>
        </g>

        {/* Route: glowing path from the front door to the marker */}
        {routeD && (
          <g pointerEvents="none">
            <path d={routeD} fill="none" stroke="#99F6E4" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
            <path
              d={routeD}
              fill="none"
              stroke="#14B8A6"
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 12"
              className="route-dash"
              opacity={0.9}
            />
          </g>
        )}

        {/* Last-seen marker */}
        {point && (
          <motion.g
            key={`${marker?.location}-${pulse ?? 0}`}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{ transformOrigin: `${point.x}px ${point.y}px` }}
          >
            <circle className="soft-glow" cx={point.x} cy={point.y} r={30} fill="#14B8A6" opacity={0.25} />
            <circle
              className="marker-ping"
              cx={point.x}
              cy={point.y}
              r={13}
              fill="none"
              stroke="#14B8A6"
              strokeWidth={3}
            />
            <circle cx={point.x} cy={point.y} r={11} fill="#FFFFFF" stroke="#0D9488" strokeWidth={3} />
            <circle cx={point.x} cy={point.y} r={4} fill="#0D9488" />
          </motion.g>
        )}
      </svg>

      {/* Tooltip */}
      {marker && (
        <motion.div
          key={`tip-${marker.location}-${pulse ?? 0}`}
          initial={{ opacity: 0, y: 6, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[125%]"
          style={{ left: `${tooltipX / 10}%`, top: `${(locationPoint(marker.location, marker.room).y) / 6.6}%` }}
        >
          <div className="rounded-lg border border-teal-100 bg-white px-3 py-2 shadow-lg shadow-teal-600/10">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-600">
              {roomName(marker.room)}
            </div>
            <div className="mt-0.5 text-[13px] font-bold text-slate-900">
              {marker.label}
            </div>
            <div className="text-[11px] text-slate-500">
              Last seen · {marker.timeLabel}
            </div>
          </div>
          <div className="mx-auto -mt-1 h-2 w-2 rotate-45 border-b border-r border-teal-100 bg-white" />
        </motion.div>
      )}

      {/* Sensor pins */}
      {showSensors &&
        SENSORS.map((s) => (
          <div
            key={s.id}
            className="group absolute z-10"
            style={{ left: `${s.x / 10}%`, top: `${s.y / 6.6}%` }}
          >
            <div className="absolute -translate-x-1/2 -translate-y-1/2">
              <div className="grid h-7 w-7 place-items-center rounded-full border border-teal-200 bg-white text-teal-600 shadow-sm transition-transform group-hover:scale-110">
                <SensorGlyph kind={s.kind} />
              </div>
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10.5px] font-medium text-white group-hover:block">
                {s.name} · {s.roomName}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

function SensorGlyph({ kind }: { kind: SensorKind }) {
  const size = 13;
  switch (kind) {
    case "camera":
      return <Camera size={size} />;
    case "motion":
      return <Radio size={size} />;
    case "temperature":
      return <Thermometer size={size} />;
    case "water":
      return <Droplets size={size} />;
    case "tag":
      return <Tag size={size} />;
  }
}

function Furniture() {
  return (
    <g fill={FURNITURE_FILL} stroke={FURNITRE_STROKE} strokeWidth={1.5}>
      {/* ---- Bedroom ---- */}
      <ellipse cx={210} cy={190} rx={85} ry={55} fill={SOFT_FILL} stroke="none" />
      <rect x={28} y={48} width={140} height={200} rx={8} />
      <rect x={38} y={58} width={120} height={30} rx={10} fill={SOFT_FILL} />
      <path d="M28,104 H168" stroke={FURNITRE_STROKE} fill="none" />
      <rect x={182} y={48} width={52} height={52} rx={6} />
      <circle cx={208} cy={74} r={8} fill={SOFT_FILL} />
      <rect x={150} y={258} width={50} height={50} rx={10} />
      <rect x={150} y={258} width={50} height={10} rx={5} fill={FURNITRE_STROKE} />
      <rect x={215} y={300} width={150} height={46} rx={6} />
      <circle cx={340} cy={318} r={6} fill={SOFT_FILL} />

      {/* ---- Study ---- */}
      <rect x={408} y={44} width={220} height={46} rx={6} />
      <rect x={492} y={50} width={72} height={34} rx={4} fill={SOFT_FILL} />
      <rect x={484} y={78} width={92} height={6} rx={3} fill={FURNITRE_STROKE} />
      <rect x={648} y={120} width={34} height={210} rx={4} />
      <path d="M650,162 H680 M650,204 H680 M650,246 H680 M650,288 H680" stroke={FURNITRE_STROKE} fill="none" />
      <rect x={500} y={120} width={48} height={48} rx={10} />

      {/* ---- Bathroom ---- */}
      <rect x={712} y={52} width={120} height={62} rx={14} />
      <rect x={722} y={62} width={100} height={42} rx={10} fill={SOFT_FILL} />
      <circle cx={872} cy={66} r={16} fill={SOFT_FILL} />
      <circle cx={872} cy={52} r={3} fill={FURNITRE_STROKE} />
      <rect x={930} y={120} width={36} height={46} rx={12} />
      <ellipse cx={948} cy={138} rx={13} ry={10} fill={SOFT_FILL} />

      {/* ---- Hall ---- */}
      <circle cx={948} cy={326} r={15} fill={SOFT_FILL} />

      {/* ---- Living room ---- */}
      <rect x={236} y={380} width={180} height={20} rx={4} />
      <rect x={254} y={386} width={144} height={8} rx={2} fill="#AFC0CB" />
      <rect x={240} y={470} width={120} height={54} rx={12} />
      <rect x={190} y={556} width={230} height={64} rx={12} />
      <rect x={200} y={566} width={62} height={44} rx={8} fill={SOFT_FILL} />
      <rect x={272} y={566} width={62} height={44} rx={8} fill={SOFT_FILL} />
      <rect x={344} y={566} width={62} height={44} rx={8} fill={SOFT_FILL} />
      <rect x={48} y={470} width={62} height={62} rx={14} />
      <circle cx={522} cy={608} r={15} fill={SOFT_FILL} />

      {/* ---- Kitchen ---- */}
      <rect x={572} y={378} width={226} height={44} rx={6} />
      <rect x={598} y={388} width={46} height={24} rx={8} fill={SOFT_FILL} />
      <circle cx={621} cy={392} r={3} fill={FURNITRE_STROKE} />
      <circle cx={735} cy={392} r={7} fill={SOFT_FILL} />
      <circle cx={757} cy={392} r={7} fill={SOFT_FILL} />
      <circle cx={735} cy={412} r={7} fill={SOFT_FILL} />
      <circle cx={757} cy={412} r={7} fill={SOFT_FILL} />
      <rect x={572} y={560} width={52} height={72} rx={6} />
      <path d="M616,575 V600" stroke={FURNITRE_STROKE} strokeWidth={3} fill="none" />

      {/* ---- Entryway ---- */}
      <rect x={938} y={430} width={36} height={130} rx={6} />
      <ellipse cx={956} cy={470} rx={10} ry={5} fill={SOFT_FILL} />
      <circle cx={944} cy={606} r={13} fill={SOFT_FILL} />
      <path d="M940,598 L938,588 M948,598 L950,588" stroke={FURNITRE_STROKE} strokeWidth={3} strokeLinecap="round" fill="none" />
      <rect x={866} y={600} width={80} height={24} rx={4} fill="none" strokeDasharray="4 4" />
    </g>
  );
}
