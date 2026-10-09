# NEST — AI Memory Layer for Your Home

**Live demo: https://juviamai.github.io/nest-demo/**

An interactive, presentation-ready prototype. NEST doesn't just control your
home — it remembers it. The centerpiece is **object memory**: ask NEST where
something is, and it answers with the **last seen time, location, and
confidence**, highlights the spot on an interactive floor plan, and shows the
underlying memory trail.

> **Demo notice:** the sensing/AI layer (cameras, sensors, event detection) is
> fully simulated with realistic mock data. No real cameras, IoT hardware, or
> computer vision are involved. A small "Demo mode" indicator in the sidebar
> makes this clear to your audience.

## What this prototype demonstrates

- **Object last-seen memory** — time, location, event type, and confidence
  for 7 tracked objects (glasses, keys, wallet, umbrella, laptop, water
  bottle, backpack)
- **Natural-language search** — "Where are my glasses?", "What did I move
  today?", "Show recent memories", and more
- **Voice interaction simulation** — listening → recognized question →
  thinking → answer (~3 seconds)
- **Interactive floor plan** — room highlighting, glowing last-seen marker,
  animated route from the front door, tooltips
- **Memory timeline** — compact event cards with day separators
- **Event detail panel** — full memory record (source, memory type,
  confidence) plus per-object event history
- **Memory pipeline visualization** — Camera + Sensors → Capture → Analyze →
  Remember → Answer, with a worked example
- **Privacy controls** — "Remember the event — not the footage", plus a
  working *Delete Today's Memories* demo interaction with restore
- **Sensing dashboard** — status of the (simulated) NEST cameras, motion /
  temperature / water sensors, and the backpack location tag

## Core interaction

1. Type **"Where are my glasses?"** in the search box (or click a suggestion
   chip / the microphone button / a tracked-object chip).
2. NEST thinks briefly, then answers: *"NEST found your glasses. Last seen on
   the bedroom desk at 8:42 PM."*
3. The floor plan highlights the bedroom and drops a glowing marker on the
   desk, with an animated route from the front door.
4. **View memory** opens the full event record; **Show event history**
   reveals the surrounding context (person entered, desk area active…).
5. Ask **"What did I move today?"** for a summarized day of object activity.
6. On **Privacy**, delete today's memories — and restore them afterwards.

## Technology

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 4
- Framer Motion (subtle animations)
- Lucide React (icons)
- Inter (bundled variable font — works offline)

No backend, no network calls after installation. All data lives in
`src/data/events.ts` and is served through modular services in
`src/services/` (`findLastSeenObject`, `getObjectHistory`,
`getTodayObjectActivity`, `answerQuery`, …), so a real sensing/AI layer can
replace the mock data later without UI changes. The query parser
(`src/services/queryParser.ts`) is intentionally simple keyword matching —
structured so an LLM can slot in.

## How to install

Requires Node.js 18+ (built and tested with Node 24).

```bash
cd D:\NEST_Demo
npm install
```

## How to run

```bash
npm run dev
```

Then open **http://localhost:5173** in your browser (16:9 laptop/projector
recommended). Production build check: `npm run build`.

## Demo scenarios (1–2 minute script)

1. **Hero:** type "Where are my glasses?" → press Enter → answer → floor plan
   highlights the bedroom desk.
2. **Memory:** click *View memory* → full record → *Show event history*.
3. **Voice:** click the microphone → simulated listening → same answer.
4. **Generalization:** click other tracked objects (keys, wallet, umbrella,
   laptop…) — floor plan re-highlights each location.
5. **Day summary:** ask "What did I move today?".
6. **Privacy:** open Privacy → *Delete Today's Memories* → confirm →
   timeline empties; restore demo data to continue.

## Future development

- Real (on-device where possible) event detection replacing the simulated
  sensing layer
- Optional LLM-backed query understanding behind the existing parser
  interface
- Multi-user memory, retention policies, and export
- Real IoT bridge for the sensor status page

Everything here is a design prototype: wording deliberately avoids absolute
privacy claims, and event records are labeled "Simulated AI event detection".
