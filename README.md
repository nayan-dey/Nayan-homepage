# Nayan Dey

A mobile-first personal portfolio. Career: Erex Studio → HSX Technologies → Safeguard.

## Run

Node 24 or newer (see .nvmrc).

```sh
npm ci
npm run dev
```

Open http://localhost:5173. A temporary HTTPS tunnel serves the production build for phone review.

```sh
npm run check
npm run build
npm run preview
```

## Stack

- Solid 2.0.0-rc.13 and matching @solidjs/web, pinned to the release candidate.
- Meta StyleX 0.19.1 with the official Vite integration and native `stylex.attrs()`.
- Official Solid Vite plugin, Vite 8, and TypeScript.
- Static prerendering followed by Solid hydration; readable content before JavaScript.
- Self-hosted Poppins (400/500/600), with no calligraphy font.
- Four original social brand glyphs from Simple Icons, using currentColor. Icons appear only in the social links. See src/ICONS.md.
- No animation framework, analytics, external font requests, or UI component library.

Vercel serves dist. Update canonical, Open Graph, JSON-LD, robots, and sitemap URLs together when changing the public domain.

## Edit

| File                                         | Purpose                                                                              |
| -------------------------------------------- | ------------------------------------------------------------------------------------ |
| src/content.ts                               | Profile, social links, companies, products, platform descriptions and core skills    |
| src/App.tsx                                  | Top navigation, platform one-liners, core skills, shared chips, theme and email copy |
| src/SocialIcons.tsx                          | Original GitHub, LinkedIn, X and Instagram glyphs                                    |
| src/global.css                               | Fonts, palette, focus, motion, reset and print rules                                 |
| index.html                                   | Metadata, initial theme and font preload                                             |
| src/entry-server.tsx / scripts/prerender.mjs | Static rendering and hydration                                                       |
| public/brands/SOURCES.md                     | Original brand asset provenance                                                      |
| DESIGN.md                                    | Current design brief and verification record                                         |

The page starts with a personal introduction. Work follows, then Core skills, About and Contact; the DOM follows that same reading order. Desktop uses aligned rows on a shared 5/7 grid, with no sidebar. A contained glass navigation bar stays at the top, with safe-area padding, anchor offsets and a current-section indicator.

Safeguard leads Work with its original logo, founding engineer role and inline Now badge. Web, desktop, mobile, CLI and MCP sit in one compact platform list, each with a short description. Every platform and the documentation remain linked; mobile has separate iOS and Android chips. Core skills presents agent engineering, model work and execution systems as three compact groups of flat violet labels. There are no engineering disclosures.

Previous company entries use plain sections, side by side on wider screens. HSX includes TBN247, Vegio, and Jayate Farms links. Erex Studio includes Food Comet and describes the delivery partner app. Company and product marks are original assets. About and Contact close the page together on desktop; the email is a text link.

The palette uses violet with neon pink accents, including the small Email me button. The deep violet dark theme follows the system until an explicit choice is saved. Mobile typography is compact, with a roughly 35px name and 17px section headings at 390px. Page gutters are 24px on phones, with more space between chips. Flat 26px pill chips are static labels; glossy pills are links. Buttons are visually 34–36px tall, with invisible hit extensions retaining at least 44×44px tap areas. The contained navigation is also fully rounded. Gloss uses a subtle highlight gradient and layered shadows; backdrop blur is limited to the top navigation. Pointer presses scale to 0.96 over 140ms. Email copying includes an HTTP fallback and one live announcement. Theme and copy feedback use text, while only social links use icons. Keyboard and reduced-motion interactions are immediate.

## Content evidence

Career order, ownership, founding engineer scope, and model fine-tuning come from Nayan’s brief. Email was explicitly confirmed. Engineering descriptions are grounded in workspace READMEs and fetched Bitbucket histories in Documents/sg. Private source, credentials, internal addresses, and customer details are excluded.

Primary product links:

- [Safeguard](https://safeguard.sh), [platform](https://app.safeguard.sh), [downloads](https://safeguard.sh/download), [MCP](https://mcp.safeguard.sh), [docs](https://docs.safeguard.sh)
- [TBN247](https://play.google.com/store/apps/details?id=com.news.ui)
- [Vegio](https://play.google.com/store/apps/details?id=com.jayatefarms.vegio)
- [Jayate Farms](https://jayatefarms.com)
- [Erex Studio](https://erexstudio.com)
- [Food Comet](https://play.google.com/store/apps/details?id=com.erex.foodcomet)

Employment dates were not supplied; the portfolio uses Now and a single Previously label. The site is printable.

## Design guidance

The current pass uses Taste and its redesign, minimalist and visual-design companions, alongside the previously requested interaction guidance:

- [Taste: design-taste-frontend](https://github.com/Leonxlnx/taste-skill/tree/main/skills/taste-skill)
- [Taste: redesign-existing-projects](https://github.com/Leonxlnx/taste-skill/tree/main/skills/redesign-skill)
- [Taste: minimalist-ui](https://github.com/Leonxlnx/taste-skill/tree/main/skills/minimalist-skill)
- [Taste: high-end-visual-design](https://github.com/Leonxlnx/taste-skill/tree/main/skills/soft-skill)
- [Jakub Krehel: Better UI](https://skills.sh/jakubkrehel/skills/better-ui)
- [Emil Kowalski: design engineering](https://skills.sh/emilkowalski/skills/emil-design-eng)

All are installed in .agents/skills; skills-lock.json records their sources. DESIGN.md documents the current layout, palette, review, and verification limits. Font notices and the original template license are retained.
