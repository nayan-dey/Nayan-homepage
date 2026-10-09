// Interface icons drawn for this site: one outline family, 1.5px stroke, currentColor.
// Platform icons sit beside 12.5px medium chip labels; sun and moon sit in the theme toggle.
// `code` marks a chip that links to a public source repository.
import type { JSX } from "@solidjs/web";

const base = {
  viewBox: "0 0 16 16",
  width: 14,
  height: 14,
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 1.5,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true",
} as const;

export type PlatformIconName = "web" | "desktop" | "ios" | "android" | "cli" | "mcp" | "docs" | "code";

const platformPaths: Record<PlatformIconName, JSX.Element> = {
  web: (
    <>
      <circle cx="8" cy="8" r="6.25" />
      <path d="M1.75 8h12.5M8 1.75c1.9 1.9 2.6 4.1 2.6 6.25S9.9 12.4 8 14.25M8 1.75C6.1 3.65 5.4 5.85 5.4 8s.7 4.4 2.6 6.25" />
    </>
  ),
  desktop: (
    <>
      <rect x="1.75" y="2.75" width="12.5" height="8.5" rx="1.5" />
      <path d="M5.5 14.25h5M8 11.25v3" />
    </>
  ),
  ios: (
    <>
      <rect x="3.75" y="1.25" width="8.5" height="13.5" rx="2" />
      <path d="M6.5 3.25h3M8 12.25h.01" />
    </>
  ),
  android: (
    <>
      <path d="M2.25 11.75a5.75 5.75 0 0 1 11.5 0Z" />
      <path d="M4.25 4.75l1.25 1.9M11.75 4.75l-1.25 1.9M6 9.75h.01M10 9.75h.01" />
    </>
  ),
  cli: (
    <>
      <rect x="1.75" y="2.75" width="12.5" height="10.5" rx="1.5" />
      <path d="M4.75 6l2 2-2 2M8.5 10.5h2.75" />
    </>
  ),
  mcp: (
    <>
      <path d="M5.5 1.75v3M10.5 1.75v3" />
      <path d="M3.25 4.75h9.5v2A4.75 4.75 0 0 1 8 11.5a4.75 4.75 0 0 1-4.75-4.75Z" />
      <path d="M8 11.5v2.75" />
    </>
  ),
  docs: (
    <>
      <path d="M9.25 1.75H4.5A1.25 1.25 0 0 0 3.25 3v10A1.25 1.25 0 0 0 4.5 14.25h7A1.25 1.25 0 0 0 12.75 13V5.25Z" />
      <path d="M9.25 1.75v3.5h3.5M5.75 8.25h4.5M5.75 10.75h4.5" />
    </>
  ),
  code: (
    <>
      <path d="M5.25 4.75 2 8l3.25 3.25M10.75 4.75 14 8l-3.25 3.25M9.25 2.75l-2.5 10.5" />
    </>
  ),
};

export function PlatformIcon(props: { name: PlatformIconName }) {
  return <svg {...base}>{platformPaths[props.name]}</svg>;
}

export function SunIcon() {
  return (
    <svg {...base} width={16} height={16}>
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.15 1.15M11.45 11.45l1.15 1.15M3.4 12.6l1.15-1.15M11.45 4.55l1.15-1.15" />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg {...base} width={16} height={16}>
      <path d="M13.6 9.9A6 6 0 1 1 6.1 2.4a4.75 4.75 0 0 0 7.5 7.5Z" />
    </svg>
  );
}

export function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.75" />
      <path d="M10.5 5.5V4a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
  );
}

/* Product tiles: 16px rounded squares that read like app icons beside a label. Griffin is
   the Safeguard purple with a spark, CLI is a dark tile with a prompt, MCP is the Model
   Context Protocol mark on white, Desktop is an ink tile with a window. */
export type TileName = "griffin" | "cli" | "mcp" | "desktop";

export function Tile(props: { name: TileName }) {
  return (
    <svg class="tile" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      {props.name === "griffin" && (
        <>
          <rect width="16" height="16" rx="4" fill="#7033FF" />
          <path d="M8 2.8 9.2 6.8 13.2 8 9.2 9.2 8 13.2 6.8 9.2 2.8 8 6.8 6.8Z" fill="#fff" />
        </>
      )}
      {props.name === "cli" && (
        <>
          <rect width="16" height="16" rx="4" fill="#18191c" />
          <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="none" stroke="rgba(255,255,255,0.16)" />
          <path d="M4.3 5.3 7 8l-2.7 2.7M8.3 10.7h3.4" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
        </>
      )}
      {props.name === "mcp" && (
        <>
          <rect width="16" height="16" rx="4" fill="#fff" />
          <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="none" stroke="rgba(0,0,0,0.12)" />
          <g transform="translate(2.5 2.5) scale(0.458)" fill="#111">
            <path d="M13.85 0a4.16 4.16 0 0 0-2.95 1.217L1.456 10.66a.835.835 0 0 0 0 1.18.835.835 0 0 0 1.18 0l9.442-9.442a2.49 2.49 0 0 1 3.541 0 2.49 2.49 0 0 1 0 3.541L8.59 12.97l-.1.1a.835.835 0 0 0 0 1.18.835.835 0 0 0 1.18 0l.1-.098 7.03-7.034a2.49 2.49 0 0 1 3.542 0l.049.05a2.49 2.49 0 0 1 0 3.54l-8.54 8.54a1.96 1.96 0 0 0 0 2.755l1.753 1.753a.835.835 0 0 0 1.18 0 .835.835 0 0 0 0-1.18l-1.753-1.753a.266.266 0 0 1 0-.394l8.54-8.54a4.185 4.185 0 0 0 0-5.9l-.05-.05a4.16 4.16 0 0 0-2.95-1.218c-.2 0-.401.02-.6.048a4.17 4.17 0 0 0-1.17-3.552A4.16 4.16 0 0 0 13.85 0m0 3.333a.84.84 0 0 0-.59.245L6.275 10.56a4.186 4.186 0 0 0 0 5.902 4.186 4.186 0 0 0 5.902 0L19.16 9.48a.835.835 0 0 0 0-1.18.835.835 0 0 0-1.18 0l-6.985 6.984a2.49 2.49 0 0 1-3.54 0 2.49 2.49 0 0 1 0-3.54l6.983-6.985a.835.835 0 0 0 0-1.18.84.84 0 0 0-.59-.245" />
          </g>
        </>
      )}
      {props.name === "desktop" && (
        <>
          <rect width="16" height="16" rx="4" fill="var(--ink)" />
          <rect x="3.5" y="4.5" width="9" height="6" rx="1" fill="none" stroke="var(--bg)" stroke-width="1.3" />
          <path d="M6 12.5h4" stroke="var(--bg)" stroke-width="1.3" stroke-linecap="round" />
        </>
      )}
    </svg>
  );
}

/* Activity icons for the Work feed: 16-unit grid, 1.5px stroke, one family with the rest. */
const activityPaths: Record<string, string> = {
  branch: "M5 3.5v9M5 3.5a1.5 1.5 0 1 0 0-.01M5 12.5a1.5 1.5 0 1 0 0 .01M11 5.5a1.5 1.5 0 1 0 0-.01M11 7c0 2.5-6 2-6 5",
  box: "M8 2.5 13.5 5.5v5L8 13.5 2.5 10.5v-5L8 2.5ZM2.7 5.6 8 8.5l5.3-2.9M8 8.5v5",
  plug: "M6 2.5v3M10 2.5v3M4.5 5.5h7v2a3.5 3.5 0 0 1-7 0v-2ZM8 11v2.5",
  bolt: "M9 2 3.5 9h4L7 14l5.5-7h-4L9 2Z",
  phone: "M5 2.5h6a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1ZM7 11.5h2",
  gauge: "M2.5 10.5a5.5 5.5 0 1 1 11 0M8 10.5l2.5-3.5M8 10.5a.5.5 0 1 0 0 .01",
  code: "M5.5 5 2.5 8l3 3M10.5 5l3 3-3 3M9 3.5l-2 9",
  thought: "M6 3.5a2.5 2.5 0 0 0-2.4 3.2A2.5 2.5 0 0 0 4.5 11.5h1a2 2 0 0 0 3.6.6A2.5 2.5 0 0 0 12 7.3 2.5 2.5 0 0 0 8.6 4.1 2.5 2.5 0 0 0 6 3.5Z",
};

export function ChevronIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m6 4 4 4-4 4" />
    </svg>
  );
}

export function ActivityGlyph(props: { name: string }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d={activityPaths[props.name] ?? activityPaths.code} />
    </svg>
  );
}

/* Agentic feed glyphs: a small sparkle for the assistant line. */
export function SparkIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M8 1.5 9.6 6.4 14.5 8 9.6 9.6 8 14.5 6.4 9.6 1.5 8 6.4 6.4Z" />
    </svg>
  );
}

/* Concept glyphs for skills that are not brands: 16-unit grid, 1.5px stroke, each with its
   own colour so the Agents and Security rows read as a set of small coloured marks. */
const concepts: Record<string, { d: string; color: string }> = {
  harness: { d: "M3 5.5A2.5 2.5 0 0 1 5.5 3h5A2.5 2.5 0 0 1 13 5.5v5a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 3 10.5v-5ZM6.5 6.5h3v3h-3z", color: "#8ea2ff" },
  loop: { d: "M3 8a5 5 0 0 1 8.6-3.5L13 6M13 2.5V6H9.5M13 8a5 5 0 0 1-8.6 3.5L3 10M3 13.5V10h3.5", color: "#f59e0b" },
  graph: { d: "M4 4.5a1.5 1.5 0 1 0 0-.01M12 4.5a1.5 1.5 0 1 0 0-.01M8 12a1.5 1.5 0 1 0 0-.01M5.3 5.5 7 10.5M10.7 5.5 9 10.5M5.5 4.5h5", color: "#22c55e" },
  context: { d: "M8 2.5 13.5 5.5 8 8.5 2.5 5.5 8 2.5ZM2.5 8.5 8 11.5l5.5-3M2.5 11 8 14l5.5-3", color: "#a78bfa" },
  multi: { d: "M8 5a2 2 0 1 0 0-.01M4 7.5a1.6 1.6 0 1 0 0-.01M12 7.5a1.6 1.6 0 1 0 0-.01M5 13.5c0-2 1.3-3.2 3-3.2s3 1.2 3 3.2M2 12.3c0-1.4.8-2.3 2-2.3M14 12.3c0-1.4-.8-2.3-2-2.3", color: "#ec4899" },
  cloud: { d: "M5 12.5h6.5a2.5 2.5 0 0 0 .3-5A4 4 0 0 0 4.2 8.6 2 2 0 0 0 5 12.5Z", color: "#38bdf8" },
  sandbox: { d: "M8 2.5 13.5 5.5v5L8 13.5 2.5 10.5v-5L8 2.5ZM2.7 5.6 8 8.5l5.3-2.9M8 8.5v5", color: "#f97316" },
  spark: { d: "M8 2.5 9.4 6.6 13.5 8 9.4 9.4 8 13.5 6.6 9.4 2.5 8 6.6 6.6 8 2.5Z", color: "#eab308" },
  browser: { d: "M2.5 4.5A1.5 1.5 0 0 1 4 3h8a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 12 12H4a1.5 1.5 0 0 1-1.5-1.5v-6ZM2.5 6h11M8.5 8l3.5 1.4-1.5.6-.6 1.5L8.5 8Z", color: "#06b6d4" },
  evals: { d: "M3 4.5h1.5M3 8h1.5M3 11.5h1.5M7 4.5h6M7 8h6M7 11.5h6", color: "#10b981" },
  sast: { d: "M8 2.5 13 4.5v3.5c0 2.8-2.2 4.8-5 5.5-2.8-.7-5-2.7-5-5.5V4.5l5-2ZM6.5 7 5 8.5 6.5 10M9.5 7 11 8.5 9.5 10", color: "#ef4444" },
  dast: { d: "M8 13.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11ZM2.5 8h11M8 2.5c2 2 2 9 0 11M8 2.5c-2 2-2 9 0 11", color: "#f97316" },
  sca: { d: "M2.5 5.5 8 2.5l5.5 3v5L8 13.5l-5.5-3v-5ZM8 8.5v5M2.7 5.6 8 8.5l5.3-2.9M10.5 6.2 5.3 3.4", color: "#f59e0b" },
  secrets: { d: "M6 10.5a3 3 0 1 1 1.3-5.7L13 4.5l1 1-1 1-1-.1-.9 1-1.2-.1-.3 1.3A3 3 0 0 1 6 10.5ZM5.3 8.2a.6.6 0 1 0 0-.01", color: "#eab308" },
  chain: { d: "M6.5 9.5l3-3M5 11l-1 1a2.1 2.1 0 0 1-3-3l2-2a2.1 2.1 0 0 1 3 0M11 5l1-1a2.1 2.1 0 0 1 3 3l-2 2a2.1 2.1 0 0 1-3 0", color: "#8b5cf6" },
  gate: { d: "M8 2.5 13 4.5v3.5c0 2.8-2.2 4.8-5 5.5-2.8-.7-5-2.7-5-5.5V4.5l5-2ZM5.8 8.2 7.3 9.7l3-3.2", color: "#22c55e" },
};

export function ConceptGlyph(props: { name: string }) {
  const c = concepts[props.name];
  if (!c) return null;
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      style={{ color: c.color }}
    >
      <path d={c.d} />
    </svg>
  );
}
