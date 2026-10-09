export const person = {
  name: "Nayan Dey",
  email: "nayande.work@gmail.com",
  location: "India",
  role: "Founding engineer",
};

export const socials = [
  { name: "GitHub", url: "https://github.com/nayan-dey" },
  { name: "X", url: "https://x.com/NayanJpg" },
] as const;

// Home: two short paragraphs under the role line. No headline; the bar carries the name.
export const intro = [
  "I build agent harnesses at Safeguard: the runtime that gives a model tools, hands work to sub-agents and runs it in cloud sandboxes, and the web, desktop, mobile and CLI apps on top of it.",
  "I came up building mobile apps and still enjoy a good native screen, but the AI era is where I spend my time now: context engineering, multi-agent orchestration, MCP and the tooling around coding agents.",
] as const;

export const safeguard = {
  name: "Safeguard",
  logo: "/brands/safeguard.png",
  url: "https://safeguard.sh",
  description: "An AI-native security platform.",
  summary:
    "I build the agent runtime and connect it to the apps we ship, working across the Go CLI, Python services and product interfaces.",
  highlights: [
    "Built a Go agent harness with sub-agent delegation, project checks and context compaction for long-running tasks.",
    "Added cloud sandboxes for isolated execution and an ACP server so editors can drive the same agent.",
    "Connected models through an OpenAI-compatible gateway and security tools through MCP, with OAuth and streamed responses.",
    "Built agent-driven browser controls on desktop, per-task skills and connector selection on mobile, and recovery for interrupted sessions.",
  ],
  // Each product gets a real mark: the Safeguard monogram, the store icon for the mobile app,
  // or a small tile (Griffin, CLI, MCP, Desktop) drawn in src/Icons.tsx.
  products: [
    { name: "Griffin AI", tile: "griffin", description: "Safeguard's security model.", url: "https://safeguard.sh/products/griffin-ai" },
    { name: "Web", logo: "/brands/safeguard-monogram.svg", description: "Security workflows in the browser.", url: "https://app.safeguard.sh" },
    { name: "Desktop", tile: "desktop", description: "Local agents, tools and context.", url: "https://safeguard.sh/download#desktop" },
    { name: "iOS", logo: "/brands/safeguard-mobile.png", description: "Safeguard on the App Store.", url: "https://apps.apple.com/in/app/safeguard-sh/id6804799039" },
    { name: "Android", logo: "/brands/safeguard-mobile.png", description: "Safeguard on Google Play.", url: "https://play.google.com/store/apps/details?id=safeguard.sh" },
    { name: "CLI", tile: "cli", description: "Run agent tasks from the terminal.", url: "https://safeguard.sh/download#cli" },
    { name: "MCP server", tile: "mcp", description: "Connected tools for AI agents.", url: "https://mcp.safeguard.sh" },
  ],
} as const;

export const about = [
  "Founding engineer at Safeguard, building the agent runtime: harness loops, sub-agent graphs, context compaction, cloud sandboxes and the MCP and ACP surfaces that let Claude, Codex, Cursor and friends drive it.",
  "My days are spent inside coding agents. Claude Code, Codex, Cursor, Pi, OpenCode and T3 Code on an Omarchy desktop, orchestrating cloud agents and shipping across Go, Python and TypeScript with Effect.",
  "Mobile taught me to care about the details people notice. The problems I chase now are the AI era's: what an agent sees, which tools it gets, where it runs and how it recovers.",
] as const;

// Skills: tools and systems in daily use. Glyphs come from src/SkillIcons.tsx; a few tools
// without a monochrome mark use a small image under public/skills.
export type Skill = { name: string; glyph?: string; concept?: string; img?: string };
export const coreSkills: { label: string; skills: Skill[] }[] = [
  {
    label: "Agents",
    skills: [
      { name: "Agent harnesses", concept: "harness" },
      { name: "Loop engineering", concept: "loop" },
      { name: "Graph engineering", concept: "graph" },
      { name: "Context engineering", concept: "context" },
      { name: "Multi-agent orchestration", concept: "multi" },
      { name: "Cloud agent orchestration", concept: "cloud" },
      { name: "Cloud sandboxes", concept: "sandbox" },
      { name: "MCP", glyph: "mcp" },
      { name: "Skills and connectors", concept: "spark" },
      { name: "Browser automation", concept: "browser" },
      { name: "Evals", concept: "evals" },
    ],
  },
  {
    label: "Coding agents",
    skills: [
      { name: "Claude Code", glyph: "claude" },
      { name: "Codex app", glyph: "openai" },
      { name: "Cursor", glyph: "cursor" },
      { name: "Devin", img: "/skills/devin.png" },
      { name: "Pi", glyph: "pi" },
      { name: "OpenCode", glyph: "opencode" },
      { name: "T3 Code", img: "/skills/t3.png" },
      { name: "Omarchy", glyph: "omarchy" },
    ],
  },
  {
    label: "Languages",
    skills: [
      { name: "Go", glyph: "go" },
      { name: "Python", glyph: "python" },
      { name: "TypeScript", glyph: "typescript" },
      { name: "Effect", glyph: "effect" },
    ],
  },
  {
    label: "Product",
    skills: [
      { name: "React", glyph: "react" },
      { name: "Next.js", glyph: "next" },
      { name: "React Native", glyph: "react" },
      { name: "Expo", glyph: "expo" },
      { name: "Electron", glyph: "electron" },
      { name: "Node.js", glyph: "node" },
      { name: "Solid", glyph: "solid" },
    ],
  },
  {
    label: "Security",
    skills: [
      { name: "SAST", concept: "sast" },
      { name: "DAST", concept: "dast" },
      { name: "SCA", concept: "sca" },
      { name: "SBOM", img: "/skills/cyclonedx.png" },
      { name: "CVE rating", img: "/skills/cve.png" },
      { name: "CVSS and EPSS", img: "/skills/first.png" },
      { name: "Secrets scanning", concept: "secrets" },
      { name: "Supply chain", concept: "chain" },
      { name: "Policy gates", concept: "gate" },
      { name: "OWASP Benchmark", glyph: "owasp" },
    ],
  },
];

export const previousWork = [
  {
    name: "HSX Technologies",
    logo: "/brands/hsx.png",
    url: "https://play.google.com/store/apps/dev?id=4939505131905348335",
    period: "Previously",
    role: "React Native developer",
    description:
      "Built news and food delivery apps with React Native, Expo and TypeScript.",
    highlights: [
      "TBN247: login, OTP, themes, profiles and settings. Replaced the icon packages with SVGs to reduce startup overhead.",
      "Vegio: restaurant browsing, checkout, payments and delivery charges, plus push notifications and onboarding for the partner apps.",
      "Jayate Farms: the public website and admin tools for managing outlets and users.",
    ],
    projects: [
      {
        name: "TBN247",
        logo: "/brands/tbn.png",
        kind: "News app on Google Play",
        url: "https://play.google.com/store/apps/details?id=com.news.ui",
      },
      {
        name: "Vegio",
        logo: "/brands/vegio.png",
        kind: "Food delivery app on Google Play",
        url: "https://play.google.com/store/apps/details?id=com.jayatefarms.vegio",
      },
      {
        name: "Jayate Farms",
        logo: "/brands/jayate.png",
        kind: "Website",
        url: "https://jayatefarms.com",
      },
    ],
  },
  {
    name: "Erex Studio",
    logo: "/brands/erex.png",
    url: "https://erexstudio.com",
    period: "Earlier",
    role: "React Native developer",
    description:
      "My first product work: building Food Comet and its delivery partner app from the ground up.",
    highlights: [
      "Worked on authentication, profiles and navigation for other client apps, including one backed by Supabase.",
      "QR Cuisine: restaurant ordering screens, bottom sheets and OTP verification. The source is public.",
    ],
    projects: [
      {
        name: "Food Comet",
        logo: "/brands/foodcomet.png",
        kind: "Food delivery app on Google Play",
        url: "https://play.google.com/store/apps/details?id=com.erex.foodcomet",
      },
      {
        name: "QR Cuisine",
        icon: "code",
        kind: "Source on GitHub",
        url: "https://github.com/nayan-dey/qr-cuisine-mobile",
      },
    ],
  },
] as const;

// The agents the Safeguard runtime is driven from, shown as a stacked row of marks that
// opens into a linked list.
export const agents = [
  { name: "Claude", src: "/agents/claude.svg", url: "https://claude.ai", note: "Anthropic" },
  { name: "ChatGPT", src: "/agents/chatgpt.svg", url: "https://chatgpt.com", note: "OpenAI" },
  { name: "Cursor", src: "/agents/cursor.svg", url: "https://cursor.com", note: "Anysphere" },
  { name: "GitHub Copilot", src: "/agents/copilot.svg", url: "https://github.com/features/copilot", note: "GitHub", pad: true },
  { name: "Gemini", src: "/agents/gemini.svg", url: "https://gemini.google.com", note: "Google", pad: true },
] as const;

// Work: the career told as one agent session, the way the ChatGPT and Codex apps show
// progress. One run covers every role: a thought, the activity rows, then each role's
// answer. Every row and sentence maps to reviewed commit history.
export type ActivityIcon = "branch" | "box" | "plug" | "bolt" | "phone" | "gauge" | "code";
export type Activity = { icon: ActivityIcon; label: string; result: string };
export type Built = {
  label: string;
  note: string;
  url: string;
  logo?: string;
  tile?: "griffin" | "cli" | "mcp" | "desktop";
  icon?: "code";
};
export type FeedTurn = {
  company: string;
  role: string;
  period: string;
  logo: string;
  url: string;
  subject: string;
  activities: Activity[];
  text: string;
  builtLabel: string;
  built: Built[];
  agents?: boolean;
};

export const feed: { prompt: string; thought: { seconds: number; note: string }; turns: FeedTurn[] } = {
  prompt: "Walk me through Nayan's work so far.",
  thought: { seconds: 2, note: "Three roles, newest first. Read the runtime work before the apps, then the two mobile roles." },
  turns: [
    {
      company: "Safeguard",
      role: "Founding engineer",
      period: "Now",
      logo: "/brands/safeguard.png",
      url: "https://safeguard.sh",
      subject: "Agent runtime and the apps that run it",
      activities: [
        { icon: "branch", label: "Read the agent runtime commits", result: "Go harness, sub-agents, context compaction" },
        { icon: "box", label: "Ran a task in a cloud sandbox", result: "Isolated run, editor attached over ACP" },
        { icon: "plug", label: "Connected security tools over MCP", result: "OAuth and streamed tool calls" },
        { icon: "bolt", label: "Delegated the apps to a sub-agent", result: "Desktop browser controls, mobile skills and connectors" },
      ],
      text: "Founding engineer at Safeguard. I build the agent harness in Go: the loop that gives a model tools, hands work to sub-agents, compacts context on long tasks and runs everything in cloud sandboxes. The same agent is reachable from editors over ACP and from the web, desktop, mobile and CLI apps I work on, with models behind an OpenAI-compatible gateway and security tools over MCP.",
      builtLabel: "7 things I built",
      built: [
        { label: "Griffin AI", note: "Safeguard's security model", tile: "griffin", url: "https://safeguard.sh/products/griffin-ai" },
        { label: "Web app", note: "Security workflows in the browser", logo: "/brands/safeguard-monogram.svg", url: "https://app.safeguard.sh" },
        { label: "Desktop", note: "Local agents, tools and context", tile: "desktop", url: "https://safeguard.sh/download#desktop" },
        { label: "iOS app", note: "On the App Store", logo: "/brands/safeguard-mobile.png", url: "https://apps.apple.com/in/app/safeguard-sh/id6804799039" },
        { label: "Android app", note: "On Google Play", logo: "/brands/safeguard-mobile.png", url: "https://play.google.com/store/apps/details?id=safeguard.sh" },
        { label: "CLI", note: "Agent tasks from the terminal", tile: "cli", url: "https://safeguard.sh/download#cli" },
        { label: "MCP server", note: "Connected tools for AI agents", tile: "mcp", url: "https://mcp.safeguard.sh" },
      ],
    },
    {
      company: "HSX Technologies",
      role: "React Native developer",
      period: "Previously",
      logo: "/brands/hsx.png",
      url: "https://play.google.com/store/apps/dev?id=4939505131905348335",
      subject: "News and food delivery apps",
      activities: [
        { icon: "phone", label: "Read the mobile app commits", result: "TBN247, Vegio, Jayate Farms" },
        { icon: "gauge", label: "Checked TBN247 start-up time", result: "Icon packages replaced with SVGs" },
      ],
      text: "Shipped news and food delivery apps with React Native, Expo and TypeScript: login, OTP, themes and settings for TBN247; restaurant browsing, checkout, payments and delivery charges for Vegio, plus push notifications and onboarding for the partner apps; and the public site and admin tools for Jayate Farms.",
      builtLabel: "3 apps I built",
      built: [
        { label: "TBN247", note: "News app on Google Play", logo: "/brands/tbn.png", url: "https://play.google.com/store/apps/details?id=com.news.ui" },
        { label: "Vegio", note: "Food delivery app on Google Play", logo: "/brands/vegio.png", url: "https://play.google.com/store/apps/details?id=com.jayatefarms.vegio" },
        { label: "Jayate Farms", note: "Website and admin tools", logo: "/brands/jayate.png", url: "https://jayatefarms.com" },
      ],
    },
    {
      company: "Erex Studio",
      role: "React Native developer",
      period: "Earlier",
      logo: "/brands/erex.png",
      url: "https://erexstudio.com",
      subject: "First product work",
      activities: [
        { icon: "phone", label: "Read the first product work", result: "Food Comet and its delivery partner app" },
        { icon: "code", label: "Opened the public source", result: "QR Cuisine on GitHub" },
      ],
      text: "My first product work: Food Comet and its delivery partner app from the ground up, then authentication, profiles and navigation for other client apps, including one on Supabase, and the ordering screens, bottom sheets and OTP flow for QR Cuisine.",
      builtLabel: "2 apps I built",
      built: [
        { label: "Food Comet", note: "Food delivery app on Google Play", logo: "/brands/foodcomet.png", url: "https://play.google.com/store/apps/details?id=com.erex.foodcomet" },
        { label: "QR Cuisine", note: "Source on GitHub", icon: "code", url: "https://github.com/nayan-dey/qr-cuisine-mobile" },
      ],
    },
  ],
};
