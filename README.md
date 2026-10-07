# Nayan Dey

A mobile-first personal portfolio. Career: Erex Studio, then HSX Technologies, now Safeguard. Design direction is recorded in DESIGN.md.

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
- Plain CSS in src/global.css with custom properties; no CSS-in-JS.
- Official Solid Vite plugin, Vite 8, and TypeScript.
- Static prerendering followed by Solid hydration; readable content before JavaScript.
- Self-hosted Geist variable font (latin subset, SIL OFL), one family for everything.
- Four original social brand glyphs from Simple Icons plus a small hand-drawn outline set for platform chips and the theme toggle, all currentColor. See src/ICONS.md.
- No router, animation framework, analytics, external font requests, or UI component library. Views switch with CSS transitions and one Web Animations API call.

Vercel serves dist. Update canonical, Open Graph, JSON-LD, robots, and sitemap URLs together when changing the public domain.

## Edit

| File                                         | Purpose                                                                              |
| -------------------------------------------- | ------------------------------------------------------------------------------------ |
| src/content.ts                               | Profile, intro and about copy, social links, companies, work lines, products, skills |
| src/App.tsx                                  | Sticky bar with navigation and theme toggle, view switching, the four panels and footer |
| src/BrandLogo.tsx / src/BrandLogo.css          | Latest Identity 03 vector wordmark with page-load, hover and touch motion |
| src/Icons.tsx                                | Outline platform icons and the sun and moon                                          |
| src/SocialIcons.tsx                          | Original GitHub, LinkedIn, X and Instagram glyphs                                    |
| src/global.css                               | Font face, dark and light tokens, layout, tabs, buttons and chips, motion rules      |
| index.html                                   | Metadata, font preload and the pre-paint theme and view script                       |
| src/entry-server.tsx / scripts/prerender.mjs | Static rendering and hydration                                                       |
| public/brands/SOURCES.md                     | Original brand asset provenance                                                      |
| DESIGN.md                                    | Current design brief and verification record                                         |

The page is one reading column with four views: Home, Work, About (which includes Skills) and Contact. The sticky translucent bar holds the name, the four navigation links and the theme toggle; on phones the links sit on a second row under the name, on desktop everything shares one row. The selected link is marked by one underline that slides along the bar's bottom edge. The links are real `role="tab"` anchors with roving tabindex, arrow, Home, End, Enter and Space keys, and `#work`, `#about` and `#contact` hashes, so deep links and back navigation work. All four panels are prerendered; a tiny script in index.html reads the hash before paint so the right view appears first, and without JavaScript every view renders in order. Nothing scrolls horizontally.

Home has no headline. It carries "Founding engineer at Safeguard" as the heading, two short paragraphs, the only Email me button, a See work button and the social links; the name lives in the bar rather than repeating in the hero. Safeguard leads the Work rows with its original mark, the founding engineer role, an intro sentence and four short lines on what was built there. Web, Desktop, iOS, Android, CLI, MCP and Docs are small wrapping link chips with outline platform icons and full accessible names, linking to app.safeguard.sh, the download page, the App Store, Google Play, mcp.safeguard.sh and docs.safeguard.sh. HSX and Erex follow with their own lines and TBN247, Vegio, Jayate Farms and Food Comet chips carrying their original marks, plus a QR Cuisine chip linking to its public repository. The Play Store screenshots stay in public/projects but are not shown on the page. About is three first-person paragraphs; Skills are four groups of static chips grounded in the reviewed contribution histories.

Two themes share one neutral structure: dark (#101113 canvas) and light (#f5e9dc warm champagne canvas with cream raised surfaces, warm charcoal ink and a subdued mauve accent), both with hairlines, a one-pixel inset highlight and fine shadows on raised controls. The first paint follows the OS; the toggle in the bar saves a choice in localStorage so the site follows the system until you choose a theme, then keeps that choice across reloads and OS changes. Theme flips suppress transitions for one frame so colours snap instead of smearing; only the sun and moon cross-fade. Geist is the only typeface. Body text is 15px on phones and 16px from 700px; chips are 26px and buttons 32px, each extended to a 44px hit area; social, theme and footer controls are 44px boxes. The page is a flex column at least one viewport tall, so the footer sits at the bottom of the screen on short views and follows the content on long ones. Contact shows the full address as a plain mailto link with a 32px Copy button beside it, no field or card; copying uses the Clipboard API with a selected-text fallback, a pending state, a polite Copied status, a stable button width across states and visible feedback if copying is unavailable. View changes from a tap fade and slide: the old panel slides 16px aside over 110ms, then the new one settles in from the opposite side over 220ms while the underline slides. Moving to a later tab goes left to right in the reading sense (the current view exits left, the next arrives from the right) and moving to an earlier tab reverses that, judged from the view actually on screen; keyboard changes are instant. One CSS arrival sequence runs on first paint only; reduced motion disables it along with smooth scrolling and transitions.

The header uses the latest, bolder Identity 03 wordmark from `public/logo-lab.html`, drawn as vectors in the current text colour. Its two N bars turn in opposite directions on page load over 640ms, each landing on its original silhouette. Fine-pointer hover adds another half turn and reverses on exit; touch release toggles the same replay while the link still goes Home. Reduced motion removes the transition. The wordmark keeps the original 44px Home target and an accessible "Nayan Dey, Home" name.

## Content evidence

Career order, ownership and founding engineer scope come from Nayan's brief. Email was explicitly confirmed. Work lines and skill chips summarise his own commits in GitHub and locally available Bitbucket histories: the Go agent harness with sub-agent delegation and context compaction, Firecracker execution, ACP, the OpenAI-compatible model gateway, MCP OAuth, streamed tool calls and recovery, agent-driven browser controls on desktop, skills and connector selection on mobile, and the earlier mobile products. Revision 29 reworded these to match current industry terms after reading the public project pages linked in DESIGN.md; no capability was added without a matching commit. Security skills also reflect the reviewed scan-pipeline and benchmark work. No model training contributions were found in the reviewed histories, so this copy does not expand that claim. Private source, repository addresses, commit identifiers, credentials, internal addresses and customer details are excluded.

Primary product links:

- [Safeguard](https://safeguard.sh), [platform](https://app.safeguard.sh), [downloads](https://safeguard.sh/download), [MCP](https://mcp.safeguard.sh), [docs](https://docs.safeguard.sh)
- [TBN247](https://play.google.com/store/apps/details?id=com.news.ui)
- [Vegio](https://play.google.com/store/apps/details?id=com.jayatefarms.vegio)
- [Jayate Farms](https://jayatefarms.com)
- [Erex Studio](https://erexstudio.com)
- [Food Comet](https://play.google.com/store/apps/details?id=com.erex.foodcomet)
- [QR Cuisine source](https://github.com/nayan-dey/qr-cuisine-mobile)

Employment dates were not supplied; the Work rows use Now, Previously and Earlier.

## Design guidance

The current rebuild was designed and implemented by Claude Fable 5.1 using Claude's official frontend-design skill:

- [Claude frontend-design](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design)

Aesthetic references for the current revision are Linear's design refresh and Liquid Glass posts and the shadcn badge and button components; the copy follows the [Unslop](https://github.com/maxgoff/unslop) writing rules; links are in DESIGN.md. Skills from previous passes remain in .agents/skills, with sources recorded in skills-lock.json. The font license is in public/fonts; the original project license is retained.
