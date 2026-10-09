import { AnimatePresence, motion } from "framer-motion";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onCancel}
            className="fixed inset-0 z-[80] bg-slate-900/25"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-[90] w-[440px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <h3 className="text-[16px] font-bold text-slate-900">{title}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-slate-500">
              {body}
            </p>
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={onCancel}
                className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`rounded-lg px-4 py-2 text-[13px] font-semibold text-white transition-colors ${
                  destructive
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
