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
  "I build agent harnesses: the software around an AI model that gives it tools, lets it hand work to sub-agents and runs that work in isolated sandboxes. At Safeguard, I work on that runtime and the web, desktop and mobile apps people use to run it.",
  "I started with food delivery and news apps. Today I work across Go, Python and TypeScript, bringing that product experience to agent infrastructure.",
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
    "Added Firecracker microVM sandboxes for isolated execution and an ACP server so editors can drive the same agent.",
    "Connected models through an OpenAI-compatible gateway and security tools through MCP, with OAuth and streamed responses.",
    "Built agent-driven browser controls on desktop, per-task skills and connector selection on mobile, and recovery for interrupted sessions.",
  ],
  platforms: [
    {
      name: "Web",
      description: "Security workflows in the browser.",
      url: "https://app.safeguard.sh",
    },
    {
      name: "Desktop",
      description: "Local agents, tools, and context.",
      url: "https://safeguard.sh/download#desktop",
    },
    {
      name: "Mobile",
      description: "Native apps for iOS and Android.",
      ios: "https://apps.apple.com/in/app/safeguard-sh/id6804799039",
      android: "https://play.google.com/store/apps/details?id=safeguard.sh",
    },
    {
      name: "CLI",
      description: "Run agent tasks from the terminal.",
      url: "https://safeguard.sh/download#cli",
    },
    {
      name: "MCP",
      description: "Connected tools for AI agents.",
      url: "https://mcp.safeguard.sh",
    },
  ],
} as const;

export const about = [
  "I started building mobile apps at Erex Studio, then worked on news and food delivery products at HSX Technologies. Today I'm a founding engineer at Safeguard, working across the apps and the agent infrastructure behind them.",
  "Mobile work taught me to care about the details people notice: login flows, keyboards and first load time. That still shapes how I build, whether I'm working on a screen or the runtime behind it.",
  "I'm comfortable moving between Go, Python and TypeScript, and following a problem from the API through to the interface.",
] as const;

// Skills are grounded in the contribution histories reviewed for this portfolio.
export const coreSkills = [
  {
    label: "Agents",
    skills: [
      "Agent harnesses",
      "Multi-agent orchestration",
      "Context engineering",
      "MCP / ACP",
      "Skill integrations",
      "Browser automation",
      "Firecracker sandboxes",
    ],
  },
  {
    label: "Backends",
    skills: ["Go", "Python", "OpenAI-compatible APIs", "Streaming tool calls", "Session recovery"],
  },
  {
    label: "Product",
    skills: ["TypeScript", "React and Next.js", "React Native and Expo", "Electron", "Node.js"],
  },
  {
    label: "Security",
    skills: ["Scan pipelines", "SBOM ingestion", "DAST", "OWASP Benchmark scoring"],
  },
] as const;

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
