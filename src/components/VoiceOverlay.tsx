import { AnimatePresence, motion } from "framer-motion";
import { Mic, Sparkles } from "lucide-react";
import { useApp } from "../state/AppState";

const DEMO_QUESTION = "Where are my glasses?";

export function VoiceOverlay() {
  const { voiceState, cancelVoice } = useApp();

  return (
    <AnimatePresence>
      {voiceState !== "idle" && (
        <>
          <motion.div
            key="voice-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={cancelVoice}
            className="fixed inset-0 z-[60] bg-slate-900/25"
          />
          <motion.div
            key="voice-card"
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-[70] w-[420px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl"
          >
            {voiceState === "listening" && (
              <div className="flex flex-col items-center">
                <div className="relative grid h-20 w-20 place-items-center">
                  <span className="voice-ring absolute inset-0 rounded-full border-2 border-teal-400" />
                  <span className="voice-ring voice-ring-2 absolute inset-0 rounded-full border-2 border-teal-300" />
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-teal-600 text-white">
                    <Mic size={26} />
                  </span>
                </div>
                <div className="mt-5 text-[16px] font-semibold text-slate-900">
                  Listening…
                </div>
                <p className="mt-1 text-[13px] text-slate-400">
                  Ask NEST about any object
                </p>
              </div>
            )}

            {voiceState === "heard" && (
              <div className="flex flex-col items-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-teal-50 text-teal-600">
                  <Mic size={22} />
                </div>
                <div className="mt-4 text-center text-[18px] font-semibold text-slate-900">
                  “{DEMO_QUESTION}”
                </div>
                <p className="mt-1.5 text-[12px] text-slate-400">
                  Recognized question · simulated voice input
                </p>
              </div>
            )}

            {voiceState === "thinking" && (
              <div className="flex flex-col items-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-teal-50 text-teal-600">
                  <Sparkles size={22} />
                </div>
                <div className="mt-4 flex items-center gap-2 text-[16px] font-semibold text-slate-900">
                  NEST is thinking
                  <span className="flex items-center gap-1 text-teal-600">
                    <span className="thinking-dot" />
                    <span className="thinking-dot" />
                    <span className="thinking-dot" />
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-slate-400">
                  Searching spatial memory
                </p>
              </div>
            )}

            <button
              onClick={cancelVoice}
              className="mt-6 w-full rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-medium text-slate-500 transition-colors hover:text-slate-800"
            >
              Cancel
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
