export function BrisaMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`brisa-mark ${className}`}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 13h16c7 0 9-7 4-8-3-1-5 1-5 3M5 20h27M8 27h15c7 0 8 7 3 8-3 0-4-2-4-3"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M13 8v24"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity=".35"
      />
    </svg>
  );
}
const paths: Record<string, string> = {
  quotes: "M8 3h8l4 4v14H4V3h4m8 0v5h5M8 12h8M8 16h5",
  orders: "M9 5H5v16h14V5h-4M9 3h6v4H9zM8 13l2 2 5-5",
  clients:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  equipment:
    "M12 2v20M3.34 7l17.32 10M3.34 17 20.66 7M8 4l4 4 4-4M8 20l4-4 4 4M3 11l5-1-1-5M21 13l-5 1 1 5M3 13l5 1-1 5M21 11l-5-1 1-5",
  agenda:
    "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2M8 14h2M14 14h2M8 18h2",
  inbox: "M4 4h16v16H4zM4 13h4l2 3h4l2-3h4M8 8h8",
  settings:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M9 3l-1 3-3 1-2 3 2 2-1 4 3 2 3-1 3 2 3-2 4 1 1-4 2-3-3-2-1-4-4-1-3-2-3 1z",
  guide:
    "M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5M12 18h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
  plus: "M12 5v14M5 12h14",
  arrow: "M5 12h14M13 6l6 6-6 6",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  menu: "M4 6h16M4 12h16M4 18h16",
  check: "M5 12l4 4L19 6",
  download: "M12 3v12M7 10l5 5 5-5M4 17v4h16v-4",
  shield: "M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4M8 12l3 3 5-6",
  clock: "M12 7v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
};
export function BrisaIcon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`brisa-icon ${className}`}
      aria-hidden="true"
    >
      <path d={paths[name] ?? paths.quotes} />
    </svg>
  );
}
export function BrisaBrand() {
  return (
    <div className="brisa-brand">
      <span className="brand-symbol">
        <BrisaMark />
      </span>
      <span className="brand-wordmark">
        brisa<span className="brand-caption">oficina & serviços</span>
      </span>
    </div>
  );
}
