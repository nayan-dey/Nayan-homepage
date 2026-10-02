export const person = {
  name: "Nayan Dey",
  email: "nayande.work@gmail.com",
  location: "India",
};

export const socials = [
  { name: "GitHub", url: "https://github.com/nayan-dey" },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/nayan-dey-sf",
  },
  { name: "X", url: "https://x.com/NayanJpg" },
  {
    name: "Instagram",
    url: "https://www.instagram.com/_nayan.dey_/",
  },
] as const;

export const safeguard = {
  name: "Safeguard",
  logo: "/brands/safeguard.png",
  url: "https://safeguard.sh",
  description: "An AI-native security platform, built end to end.",
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
      description: "Apps for",
      ios: "https://apps.apple.com/in/app/safeguard-sh/id6804799039",
      android: "https://play.google.com/store/apps/details?id=safeguard.sh",
    },
    {
      name: "CLI",
      description: "A Go harness for agent workflows.",
      url: "https://safeguard.sh/download#cli",
    },
    {
      name: "MCP",
      description: "Connected tools for AI agents.",
      url: "https://mcp.safeguard.sh",
    },
  ],
} as const;

export const coreSkills = [
  {
    label: "Agents",
    tone: "sage",
    skills: ["Loop engineering", "Tool orchestration", "MCP & ACP"],
  },
  {
    label: "Models",
    tone: "clay",
    skills: ["Model fine-tuning", "Evaluation", "Feedback loops"],
  },
  {
    label: "Systems",
    skills: [
      "Isolated execution",
      "Firecracker microVMs",
      "Security pipelines",
    ],
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
      "Built mobile products for news and vegetarian food delivery, alongside the Jayate Farms website.",
    projects: [
      {
        name: "TBN247",
        logo: "/brands/tbn.png",
        kind: "News app",
        url: "https://play.google.com/store/apps/details?id=com.news.ui",
      },
      {
        name: "Vegio",
        logo: "/brands/vegio.png",
        kind: "Food delivery",
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
      "Built Food Comet and its delivery partner app from the ground up, working across the ordering and delivery experience.",
    projects: [
      {
        name: "Food Comet",
        logo: "/brands/foodcomet.png",
        kind: "Food delivery",
        url: "https://play.google.com/store/apps/details?id=com.erex.foodcomet",
      },
    ],
  },
] as const;
