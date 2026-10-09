/** Time as "8:42 PM" */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** "October 8, 2026" */
export function formatDayDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** "October 8, 2026 · 8:42 PM" */
export function formatFull(iso: string): string {
  return `${formatDayDate(iso)} · ${formatTime(iso)}`;
}

const sameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export function isToday(iso: string): boolean {
  return sameDay(new Date(iso), new Date());
}

export function isYesterday(iso: string): boolean {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return sameDay(new Date(iso), y);
}

/** "Today" / "Yesterday" / "October 7" */
export function dayLabel(iso: string): string {
  if (isToday(iso)) return "Today";
  if (isYesterday(iso)) return "Yesterday";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

/** "Wednesday, October 8, 2026" for the top bar */
export function todayLong(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** 0.96 -> "96%" */
export function confidencePercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
