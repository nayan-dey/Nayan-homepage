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
