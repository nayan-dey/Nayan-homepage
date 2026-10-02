import { createSignal, onSettled } from "solid-js";
import * as stylex from "@stylexjs/stylex";
import {
  coreSkills,
  person,
  previousWork,
  safeguard,
  socials,
} from "./content";
import { SocialIcon } from "./SocialIcons";
import type { SocialIconName } from "./SocialIcons";

const navItems = [
  ["work", "Work"],
  ["skills", "Skills"],
  ["contact", "Contact"],
] as const;

function pressClass(
  attributes: ReturnType<typeof stylex.attrs>,
  extraClass = "",
) {
  return [attributes.class, "pressable", extraClass].filter(Boolean).join(" ");
}

function interactiveAttrs(
  attributes: ReturnType<typeof stylex.attrs>,
  extraClass = "",
) {
  return { ...attributes, class: pressClass(attributes, extraClass) };
}

type ChipProps = {
  label: string;
  socialIcon?: SocialIconName;
  logo?: string;
  interactive?: boolean;
  compact?: boolean;
};

// Glossy chips are touchable; flat tinted chips are static labels.
function Chip(props: ChipProps) {
  return (
    <span
      {...stylex.attrs(
        s.chip,
        props.interactive ? s.linkChip : s.staticChip,
        Boolean(props.logo) && s.chipWithLogo,
        Boolean(props.socialIcon) && s.chipWithIcon,
        Boolean(props.compact) && s.badge,
      )}
    >
      {props.logo && (
        <img
          src={props.logo}
          alt=""
          width="18"
          height="18"
          loading="lazy"
          {...stylex.attrs(s.chipLogo)}
        />
      )}
      {props.socialIcon && <SocialIcon name={props.socialIcon} />}
      <span>{props.label}</span>
    </span>
  );
}

function ChipLink(
  props: Omit<ChipProps, "interactive" | "compact"> & {
    url: string;
    className: string;
    ariaLabel?: string;
  },
) {
  return (
    <a
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={props.ariaLabel}
      {...interactiveAttrs(
        stylex.attrs(s.chipHit),
        "chip-link " + props.className,
      )}
    >
      <Chip
        label={props.label}
        socialIcon={props.socialIcon}
        logo={props.logo}
        interactive
      />
    </a>
  );
}

function SectionHead(props: { id: string; title: string }) {
  return (
    <div {...stylex.attrs(s.sectionHead)}>
      <h2 id={props.id} {...stylex.attrs(s.sectionTitle)}>
        {props.title}
      </h2>
      <span aria-hidden="true" {...stylex.attrs(s.sectionRule)} />
    </div>
  );
}

function PlatformRow(props: {
  platform: (typeof safeguard.platforms)[number];
}) {
  const platform = props.platform;
  if (platform.name === "Mobile") {
    return (
      <div {...stylex.attrs(s.platformRow)}>
        <span {...stylex.attrs(s.platformName)}>{platform.name}</span>
        <span {...stylex.attrs(s.platformDescription, s.storeLinks)}>
          <span {...stylex.attrs(s.storeLead)}>{platform.description}</span>
          <ChipLink
            label="iOS"
            url={platform.ios}
            ariaLabel="Safeguard for iOS"
            className="mobile-link"
          />
          <ChipLink
            label="Android"
            url={platform.android}
            ariaLabel="Safeguard for Android"
            className="mobile-link"
          />
        </span>
      </div>
    );
  }
  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      {...interactiveAttrs(stylex.attrs(s.platformRow), "platform-link")}
    >
      <span {...stylex.attrs(s.platformName)}>{platform.name}</span>
      <span {...stylex.attrs(s.platformDescription)}>
        {platform.description}
      </span>
    </a>
  );
}

function CompanyHeading(props: {
  name: string;
  logo: string;
  url: string;
  role: string;
  id: string;
  featured?: boolean;
  badge?: string;
}) {
  const size = props.featured ? 40 : 28;
  return (
    <a
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
      {...interactiveAttrs(stylex.attrs(s.companyLink), "company-link")}
    >
      <img
        src={props.logo}
        width={size}
        height={size}
        alt=""
        loading={props.featured ? undefined : "lazy"}
        {...stylex.attrs(s.companyLogo, props.featured && s.featureLogo)}
      />
      <div {...stylex.attrs(s.companyIdentity)}>
        <h3
          id={props.id}
          {...stylex.attrs(s.companyName, props.featured && s.featureName)}
        >
          {props.name}
        </h3>
        <p {...stylex.attrs(s.role, props.featured && s.featureRole)}>
          {props.role}
          {props.badge && <Chip label={props.badge} compact />}
        </p>
      </div>
    </a>
  );
}

function SkillGroup(props: { group: (typeof coreSkills)[number] }) {
  const group = props.group;
  return (
    <div {...stylex.attrs(s.skillGroup)}>
      <h3 {...stylex.attrs(s.skillLabel)}>{group.label}</h3>
      <ul {...stylex.attrs(s.skillList)}>
        {group.skills.map((skill) => (
          <li>
            <Chip label={skill} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [theme, setTheme] = createSignal("system");
  const [current, setCurrent] = createSignal("");
  const [copyState, setCopyState] = createSignal("");
  const [copying, setCopying] = createSignal(false);
  let copyTimer: ReturnType<typeof setTimeout> | undefined;
  let explicitTheme = false;

  function applyTheme(value: string) {
    const root = document.documentElement;
    // Better UI: commit the new palette without every transition firing at once.
    const freeze = document.createElement("style");
    freeze.textContent = "*,*::before,*::after{transition:none!important}";
    document.head.append(freeze);
    root.dataset.theme = value;
    setTheme(value);
    const paper = getComputedStyle(root).getPropertyValue("--paper").trim();
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        paper || (value === "dark" ? "#120d1d" : "#faf8fd"),
      );
    requestAnimationFrame(() => requestAnimationFrame(() => freeze.remove()));
  }

  function toggleTheme() {
    explicitTheme = true;
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("nayan-theme", next);
    } catch {}
  }

  async function copyEmail() {
    clearTimeout(copyTimer);
    setCopying(true);
    try {
      if (!navigator.clipboard || !window.isSecureContext)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(person.email);
      setCopyState("Email copied");
    } catch {
      const input = document.createElement("textarea");
      input.value = person.email;
      input.style.cssText = "position:fixed;opacity:0;font-size:16px";
      const previous = document.activeElement as HTMLElement | null;
      document.body.appendChild(input);
      input.focus();
      input.select();
      input.setSelectionRange(0, input.value.length);
      const copied = document.execCommand("copy");
      input.remove();
      previous?.focus();
      setCopyState(copied ? "Email copied" : "Select the address to copy");
    } finally {
      setCopying(false);
    }
    copyTimer = setTimeout(() => setCopyState(""), 2800);
  }

  onSettled(() => {
    setTheme(document.documentElement.dataset.theme || "light");
    try {
      const savedTheme = localStorage.getItem("nayan-theme");
      explicitTheme = savedTheme === "light" || savedTheme === "dark";
    } catch {}
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = (event: MediaQueryListEvent) => {
      if (!explicitTheme) applyTheme(event.matches ? "dark" : "light");
    };
    systemTheme.addEventListener("change", syncSystemTheme);
    const pointerInput = () => {
      document.documentElement.dataset.input = "pointer";
    };
    const keyboardInput = () => {
      document.documentElement.dataset.input = "keyboard";
    };
    document.addEventListener("pointerdown", pointerInput, { passive: true });
    document.addEventListener("keydown", keyboardInput);

    // Current section: the last one whose top has crossed 45% of the viewport.
    // Contact sits at the page end, so it also counts once mostly visible.
    const passed = new Set<string>();
    let contactInView = false;
    const sync = () => {
      let next = "";
      for (const [id] of navItems) if (passed.has(id)) next = id;
      setCurrent(contactInView ? "contact" : next);
    };
    const lineObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const line = entry.rootBounds?.bottom ?? window.innerHeight * 0.45;
          if (entry.boundingClientRect.top < line) passed.add(entry.target.id);
          else passed.delete(entry.target.id);
        }
        sync();
      },
      { rootMargin: "0px 0px -55% 0px" },
    );
    const contactObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          contactInView = entry.intersectionRatio >= 0.58;
        sync();
      },
      { threshold: [0, 0.6, 1] },
    );
    for (const [id] of navItems) {
      const section = document.getElementById(id);
      if (section) lineObserver.observe(section);
    }
    const contact = document.getElementById("contact");
    if (contact) contactObserver.observe(contact);

    return () => {
      systemTheme.removeEventListener("change", syncSystemTheme);
      document.removeEventListener("pointerdown", pointerInput);
      document.removeEventListener("keydown", keyboardInput);
      lineObserver.disconnect();
      contactObserver.disconnect();
      clearTimeout(copyTimer);
    };
  });

  return (
    <>
      <a class="skip-link" href="#main">
        Skip to content
      </a>
      <header {...stylex.attrs(s.header)}>
        <div {...stylex.attrs(s.bar)}>
          <a
            href="#intro"
            aria-label="Nayan Dey, home"
            onClick={() => setCurrent("")}
            {...interactiveAttrs(stylex.attrs(s.hit, s.wordmark))}
          >
            Nayan<span {...stylex.attrs(s.wordmarkRest)}>{"\u00a0Dey"}</span>
          </a>
          <div {...stylex.attrs(s.barEnd)}>
            <nav aria-label="Main navigation" {...stylex.attrs(s.nav)}>
              {navItems.map(([id, label]) => (
                <a
                  href={"#" + id}
                  aria-current={current() === id ? "location" : undefined}
                  onClick={() => setCurrent(id)}
                  {...interactiveAttrs(
                    stylex.attrs(s.hit, s.navLink),
                    "nav-link",
                  )}
                >
                  {label}
                </a>
              ))}
            </nav>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Dark theme"
              aria-pressed={theme() === "dark" ? "true" : "false"}
              class={pressClass(
                stylex.attrs(
                  s.hit,
                  s.themeButton,
                  theme() === "dark" && s.themeOn,
                ),
                "theme-button",
              )}
            >
              Dark
            </button>
          </div>
        </div>
      </header>

      <div {...stylex.attrs(s.page)}>
        <main id="main" tabindex="-1">
          <section
            id="intro"
            aria-labelledby="intro-title"
            {...stylex.attrs(s.hero)}
          >
            <h1 id="intro-title" {...stylex.attrs(s.name)}>
              {person.name}
              <span {...stylex.attrs(s.nameMark)}>.</span>
            </h1>
            <p {...stylex.attrs(s.statement)}>
              Engineer & product builder,{" "}
              <span {...stylex.attrs(s.quiet)}>from idea to production.</span>
            </p>
            <div {...stylex.attrs(s.heroAside)}>
              <p {...stylex.attrs(s.heroBody)}>
                I work across interfaces, AI agents, and infrastructure.
              </p>
              <a
                href={"mailto:" + person.email}
                {...interactiveAttrs(stylex.attrs(s.hit, s.primaryAction))}
              >
                Email me
              </a>
            </div>
          </section>

          <section id="work" aria-labelledby="work-title">
            <SectionHead id="work-title" title="Work" />
            <article
              aria-labelledby="safeguard-title"
              {...stylex.attrs(s.feature)}
            >
              <div {...stylex.attrs(s.featureIntro)}>
                <CompanyHeading
                  name={safeguard.name}
                  logo={safeguard.logo}
                  url={safeguard.url}
                  role="Founding engineer"
                  id="safeguard-title"
                  badge="Now"
                  featured
                />
                <p {...stylex.attrs(s.featureDescription)}>
                  {safeguard.description}
                </p>
              </div>
              <div {...stylex.attrs(s.platformsBlock)}>
                <ul
                  aria-label="Safeguard platforms"
                  {...stylex.attrs(s.platforms)}
                >
                  {safeguard.platforms.map((platform, index) => (
                    <li
                      {...stylex.attrs(
                        s.platformItem,
                        index > 0 && s.platformDivider,
                      )}
                    >
                      <PlatformRow platform={platform} />
                    </li>
                  ))}
                </ul>
                <a
                  href="https://docs.safeguard.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...interactiveAttrs(stylex.attrs(s.docsLink), "docs-link")}
                >
                  Read the docs
                </a>
              </div>
            </article>

            <div {...stylex.attrs(s.history)}>
              <p {...stylex.attrs(s.historyLabel)}>Previously</p>
              <div {...stylex.attrs(s.historyGrid)}>
                {previousWork.map((company, index) => (
                  <article
                    aria-labelledby={"company-" + index}
                    {...stylex.attrs(s.historyItem)}
                  >
                    <CompanyHeading
                      name={company.name}
                      logo={company.logo}
                      url={company.url}
                      role={company.role}
                      id={"company-" + index}
                    />
                    <p {...stylex.attrs(s.historyDescription)}>
                      {company.description}
                    </p>
                    <ul
                      aria-label={company.name + " projects"}
                      {...stylex.attrs(s.projectLinks)}
                    >
                      {company.projects.map((project) => (
                        <li>
                          <ChipLink
                            label={project.name}
                            logo={project.logo}
                            url={project.url}
                            ariaLabel={project.name + ", " + project.kind}
                            className="project-link"
                          />
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section
            id="skills"
            aria-labelledby="skills-title"
            {...stylex.attrs(s.block)}
          >
            <SectionHead id="skills-title" title="Core skills" />
            <div {...stylex.attrs(s.skillGrid)}>
              <SkillGroup group={coreSkills[0]} />
              <div {...stylex.attrs(s.skillGridRest)}>
                {coreSkills.slice(1).map((group) => (
                  <SkillGroup group={group} />
                ))}
              </div>
            </div>
          </section>

          <div {...stylex.attrs(s.closing)}>
            <section id="about" aria-labelledby="about-title">
              <SectionHead id="about-title" title="About" />
              <p {...stylex.attrs(s.aboutLead)}>
                I started with React Native apps. Today I build complete
                products, from interfaces and backend services to agent loops
                and model behavior.
              </p>
              <p {...stylex.attrs(s.aboutBody)}>
                I care about fast software and the small details people feel.
              </p>
            </section>

            <section id="contact" aria-labelledby="contact-title">
              <SectionHead id="contact-title" title="Contact" />
              <p {...stylex.attrs(s.contactNote)}>
                Ideas, projects, or just hello.
              </p>
              <a
                href={"mailto:" + person.email}
                {...interactiveAttrs(stylex.attrs(s.emailLink), "email-link")}
              >
                {person.email}
              </a>
              <div {...stylex.attrs(s.copyRow)}>
                <button
                  type="button"
                  disabled={copying()}
                  onClick={copyEmail}
                  {...interactiveAttrs(stylex.attrs(s.hit, s.copyButton))}
                >
                  {copyState() === "Email copied" ? "Copied" : "Copy email"}
                </button>
                <p
                  role="status"
                  aria-live="polite"
                  {...stylex.attrs(s.copyStatus)}
                >
                  {copyState() === "Email copied" ? (
                    <span {...stylex.attrs(s.srOnly)}>Email copied</span>
                  ) : (
                    copyState()
                  )}
                </p>
              </div>
              <nav aria-label="Social profiles" {...stylex.attrs(s.socials)}>
                {socials.map((social) => (
                  <ChipLink
                    label={social.name}
                    socialIcon={social.name as SocialIconName}
                    url={social.url}
                    className="profile-link"
                  />
                ))}
              </nav>
            </section>
          </div>
        </main>

        <footer {...stylex.attrs(s.footer)}>
          <p>
            {person.name} · {person.location}
          </p>
          <a
            href="https://github.com/nayan-dey/Nayan-homepage"
            target="_blank"
            rel="noopener noreferrer"
            {...interactiveAttrs(stylex.attrs(s.sourceLink), "text-link")}
          >
            View source
          </a>
        </footer>
      </div>
    </>
  );
}

const narrow = "@media (max-width: 329.98px)";
const phone = "@media (min-width: 380px)";
const tablet = "@media (min-width: 640px)";
const desktop = "@media (min-width: 960px)";
const hover = "@media (hover: hover) and (pointer: fine)";
// One 5/7 split carries the hero, work, history, skills and closing rows.
const split = "minmax(0, 5fr) minmax(0, 7fr)";

const s = stylex.create({
  // Visible controls stay compact; this invisible layer keeps a 44px target.
  hit: {
    position: "relative",
    "::before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "max(100%, 44px)",
      height: "max(100%, 44px)",
      transform: "translate(-50%, -50%)",
    },
  },
  // Header gutter + bar padding + wordmark padding = page gutter, so the
  // wordmark lines up with the content column at every breakpoint.
  header: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    pointerEvents: "none",
    paddingTop: {
      default: "calc(8px + env(safe-area-inset-top))",
      [desktop]: "calc(12px + env(safe-area-inset-top))",
    },
    paddingInline: {
      default: 12,
      [narrow]: 8,
      [tablet]: 24,
      [desktop]: 36,
    },
  },
  bar: {
    pointerEvents: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: { default: 0, [phone]: 8 },
    maxWidth: 1048,
    minHeight: 46,
    marginInline: "auto",
    padding: 6,
    borderRadius: 999,
    backgroundColor: "var(--glass)",
    backdropFilter: "blur(16px) saturate(140%)",
    WebkitBackdropFilter: "blur(16px) saturate(140%)",
    boxShadow: "var(--glass-edge)",
  },
  wordmark: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 34,
    minWidth: 44,
    paddingInline: { default: 8, [tablet]: 12, [desktop]: 8 },
    borderRadius: 999,
    color: "var(--ink)",
    fontSize: { default: 14, [phone]: 15 },
    fontWeight: 600,
    letterSpacing: "-0.02em",
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
  wordmarkRest: { display: { default: "inline", [narrow]: "none" } },
  barEnd: {
    display: "flex",
    alignItems: "center",
    gap: { default: 2, [phone]: 6 },
  },
  nav: { display: "flex", alignItems: "center" },
  navLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 34,
    minWidth: 44,
    paddingInline: { default: 6, [narrow]: 4, [phone]: 8, [tablet]: 12 },
    borderRadius: 999,
    color: "var(--muted)",
    fontSize: { default: 13, [narrow]: 12, [tablet]: 14 },
    fontWeight: 500,
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
  themeButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    minHeight: 34,
    minWidth: 44,
    paddingInline: { default: 10, [narrow]: 8, [phone]: 12, [tablet]: 14 },
    borderWidth: 0,
    borderRadius: 999,
    backgroundColor: "var(--chip-bg)",
    backgroundImage: "var(--chip-sheen)",
    boxShadow: "var(--chip-shadow)",
    color: "var(--ink)",
    fontSize: { default: 13, [narrow]: 12, [tablet]: 14 },
    fontWeight: 500,
  },
  themeOn: { backgroundColor: "var(--sage)", color: "var(--sage-ink)" },
  page: {
    maxWidth: 1120,
    marginInline: "auto",
    paddingInline: { default: 24, [narrow]: 20, [tablet]: 40, [desktop]: 48 },
  },
  hero: {
    display: "grid",
    gridTemplateColumns: { default: "minmax(0, 1fr)", [desktop]: split },
    columnGap: 72,
    alignItems: "start",
    paddingTop: { default: 40, [tablet]: 64, [desktop]: 80 },
    paddingBottom: { default: 48, [tablet]: 72, [desktop]: 96 },
  },
  name: {
    gridColumn: { default: "auto", [desktop]: "1 / -1" },
    marginInlineStart: "-0.03em",
    color: "var(--ink)",
    fontSize: "clamp(2.125rem, 6vw + 0.75rem, 3.25rem)",
    fontWeight: 600,
    lineHeight: 1.08,
    letterSpacing: "-0.04em",
  },
  nameMark: { color: "var(--pop)" },
  statement: {
    maxWidth: { default: 560, [desktop]: "none" },
    marginTop: { default: 14, [desktop]: 20 },
    color: "var(--ink)",
    fontSize: {
      default: "clamp(1.125rem, 0.8vw + 0.95rem, 1.25rem)",
      [desktop]: "1.375rem",
    },
    fontWeight: 500,
    lineHeight: 1.35,
    letterSpacing: "-0.02em",
    textWrap: "balance",
  },
  quiet: { color: "var(--muted)" },
  heroAside: {
    marginTop: { default: 12, [desktop]: 20 },
    paddingTop: { default: 0, [desktop]: 4 },
  },
  heroBody: {
    maxWidth: 420,
    color: "var(--muted)",
    fontSize: { default: 14, [tablet]: 15, [desktop]: 16 },
    lineHeight: 1.6,
    textWrap: "pretty",
  },
  primaryAction: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
    marginTop: { default: 22, [desktop]: 24 },
    paddingInline: 18,
    borderRadius: 999,
    backgroundColor: {
      default: "var(--pop)",
      ":hover": {
        default: null,
        [hover]: "color-mix(in oklab, var(--pop) 92%, var(--paper))",
      },
    },
    boxShadow:
      "inset 0 1px 0 rgb(255 255 255 / 16%), 0 1px 2px -1px color-mix(in oklab, var(--ink) 30%, transparent), 0 6px 14px -6px color-mix(in oklab, var(--ink) 35%, transparent)",
    color: "var(--action-ink)",
    fontSize: 13.5,
    fontWeight: 500,
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
  block: { marginTop: { default: 64, [desktop]: 112 } },
  sectionHead: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: { default: 20, [desktop]: 32 },
  },
  sectionTitle: {
    color: "var(--ink)",
    fontSize: { default: 17, [desktop]: 20 },
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: "-0.025em",
    whiteSpace: "nowrap",
  },
  sectionRule: { flex: 1, height: 1, backgroundColor: "var(--divider)" },
  feature: {
    display: "grid",
    gridTemplateColumns: { default: "minmax(0, 1fr)", [desktop]: split },
    columnGap: 72,
    rowGap: 20,
    alignItems: "start",
  },
  featureIntro: { minWidth: 0 },
  companyLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    maxWidth: "100%",
    minHeight: 44,
    borderRadius: 14,
    color: "var(--ink)",
    textDecoration: "none",
  },
  companyLogo: {
    width: 28,
    height: 28,
    flexShrink: 0,
    borderRadius: 8,
    objectFit: "cover",
  },
  featureLogo: { width: 40, height: 40, borderRadius: 12 },
  companyIdentity: { minWidth: 0 },
  companyName: {
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.35,
    letterSpacing: "-0.015em",
  },
  featureName: {
    fontSize: { default: 19, [desktop]: 22 },
    lineHeight: 1.2,
    letterSpacing: "-0.025em",
  },
  role: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
    color: "var(--muted)",
    fontSize: 12.5,
    lineHeight: 1.5,
  },
  featureRole: {
    marginTop: 2,
    color: "var(--ink)",
    fontSize: 13,
    fontWeight: 500,
  },
  featureDescription: {
    maxWidth: 400,
    marginTop: { default: 14, [desktop]: 20 },
    color: "var(--ink)",
    fontSize: { default: 15, [desktop]: 17 },
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: "-0.015em",
    textWrap: "balance",
  },
  platformsBlock: { minWidth: 0 },
  platforms: {
    listStyle: "none",
    margin: 0,
    padding: 4,
    borderRadius: 20,
    backgroundColor: "var(--soft-white)",
    boxShadow: "var(--chip-shadow)",
  },
  platformItem: { marginInline: { default: 10, [desktop]: 16 } },
  platformDivider: {
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "var(--divider)",
  },
  platformRow: {
    display: "grid",
    gridTemplateColumns: {
      default: "56px minmax(0, 1fr)",
      [tablet]: "80px minmax(0, 1fr)",
    },
    alignItems: "center",
    columnGap: { default: 12, [tablet]: 20 },
    minHeight: { default: 48, [desktop]: 52 },
    paddingBlock: 4,
    paddingInline: { default: 10, [desktop]: 16 },
    marginInline: { default: -10, [desktop]: -16 },
    borderRadius: 16,
    color: "var(--ink)",
    textDecoration: "none",
  },
  platformName: {
    color: "var(--sage-ink)",
    fontSize: { default: 12.5, [tablet]: 13.5 },
    fontWeight: 500,
    lineHeight: 1.4,
  },
  platformDescription: {
    color: "var(--muted)",
    fontSize: { default: 13, [desktop]: 14 },
    lineHeight: 1.45,
  },
  storeLinks: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: 4,
  },
  storeLead: { marginInlineEnd: 4 },
  docsLink: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 44,
    marginTop: 6,
    paddingInline: { default: 14, [desktop]: 20 },
    borderRadius: 999,
    color: "var(--sage-ink)",
    fontSize: 13.5,
    fontWeight: 500,
    textDecoration: "underline",
    textDecorationColor:
      "color-mix(in oklab, var(--sage-ink) 35%, transparent)",
    textUnderlineOffset: "5px",
  },
  history: {
    marginTop: { default: 44, [desktop]: 64 },
    paddingTop: { default: 24, [desktop]: 32 },
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "var(--divider)",
  },
  historyLabel: {
    color: "var(--muted)",
    fontSize: 12.5,
    fontWeight: 500,
    lineHeight: 1.4,
  },
  historyGrid: {
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      [tablet]: "repeat(2, minmax(0, 1fr))",
      [desktop]: split,
    },
    columnGap: { default: 40, [desktop]: 72 },
    rowGap: 28,
    marginTop: 14,
  },
  historyItem: { minWidth: 0 },
  historyDescription: {
    maxWidth: 440,
    marginTop: 10,
    color: "var(--muted)",
    fontSize: { default: 13.5, [desktop]: 14 },
    lineHeight: 1.6,
    textWrap: "pretty",
  },
  projectLinks: {
    display: "flex",
    flexWrap: "wrap",
    listStyle: "none",
    margin: 0,
    marginTop: 8,
    marginLeft: -4,
    marginRight: -4,
    padding: 0,
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    minHeight: 26,
    paddingBlock: 3,
    paddingInline: 11,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.3,
    whiteSpace: "nowrap",
  },
  staticChip: { backgroundColor: "var(--sage)", color: "var(--sage-ink)" },
  linkChip: {
    backgroundColor: "var(--chip-bg)",
    backgroundImage: "var(--chip-sheen)",
    boxShadow: "var(--chip-shadow)",
    color: "var(--ink)",
  },
  chipWithLogo: { paddingInlineStart: 4 },
  chipWithIcon: { paddingInlineStart: 9 },
  badge: {
    minHeight: 20,
    paddingBlock: 1,
    paddingInline: 8,
    borderRadius: 999,
    fontSize: 11.5,
  },
  chipLogo: {
    width: 18,
    height: 18,
    flexShrink: 0,
    borderRadius: 6,
    objectFit: "contain",
    backgroundColor: "#ffffff",
  },
  chipHit: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    paddingInline: 4,
    borderRadius: 999,
    color: "var(--ink)",
    textDecoration: "none",
  },
  skillGrid: {
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      [tablet]: "repeat(3, minmax(0, 1fr))",
      [desktop]: split,
    },
    columnGap: { default: 40, [desktop]: 72 },
    rowGap: 22,
  },
  skillGridRest: {
    display: { default: "contents", [desktop]: "grid" },
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    columnGap: 40,
  },
  skillGroup: { display: "grid", alignContent: "start", gap: 10, minWidth: 0 },
  skillLabel: {
    color: "var(--ink)",
    fontSize: 12.5,
    fontWeight: 500,
    lineHeight: 1.4,
  },
  skillList: {
    display: "flex",
    flexDirection: { default: "row", [tablet]: "column" },
    flexWrap: { default: "wrap", [tablet]: "nowrap" },
    alignItems: "flex-start",
    columnGap: 8,
    rowGap: 8,
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  closing: {
    display: "grid",
    gridTemplateColumns: { default: "minmax(0, 1fr)", [desktop]: split },
    columnGap: 72,
    rowGap: 64,
    alignItems: "start",
    marginTop: { default: 64, [desktop]: 112 },
  },
  aboutLead: {
    maxWidth: 420,
    color: "var(--ink)",
    fontSize: { default: 15, [desktop]: 16 },
    lineHeight: 1.6,
    letterSpacing: "-0.01em",
    textWrap: "pretty",
  },
  aboutBody: {
    maxWidth: 420,
    marginTop: 10,
    color: "var(--muted)",
    fontSize: { default: 14, [desktop]: 15 },
    lineHeight: 1.6,
    textWrap: "pretty",
  },
  contactNote: {
    color: "var(--muted)",
    fontSize: { default: 14, [desktop]: 15 },
    lineHeight: 1.6,
  },
  emailLink: {
    display: "inline-flex",
    alignItems: "center",
    maxWidth: "calc(100% + 24px)",
    minHeight: 44,
    marginTop: 8,
    marginInline: -12,
    paddingBlock: 4,
    paddingInline: 12,
    borderRadius: 999,
    color: "var(--ink)",
    fontSize: "clamp(1rem, 3vw + 0.4rem, 1.5rem)",
    fontWeight: 500,
    lineHeight: 1.3,
    letterSpacing: "-0.025em",
    textDecoration: "underline",
    textDecorationColor: "var(--divider)",
    textDecorationThickness: "1px",
    textUnderlineOffset: "6px",
    overflowWrap: "anywhere",
  },
  copyRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: 14,
    rowGap: 4,
    minHeight: 44,
    marginTop: 8,
  },
  copyButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: 100,
    minHeight: 34,
    borderWidth: 0,
    borderRadius: 999,
    backgroundColor: "var(--chip-bg)",
    backgroundImage: "var(--chip-sheen)",
    boxShadow: "var(--chip-shadow)",
    color: "var(--ink)",
    fontSize: 13,
    fontWeight: 500,
  },
  copyStatus: { color: "var(--muted)", fontSize: 12.5, lineHeight: 1.5 },
  srOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
    borderWidth: 0,
  },
  socials: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: 12,
    marginInline: -4,
  },
  footer: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 24,
    marginTop: { default: 64, [desktop]: 104 },
    paddingTop: 8,
    paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "var(--divider)",
    color: "var(--muted)",
    fontSize: 12.5,
  },
  sourceLink: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 44,
    borderRadius: 999,
    color: "var(--muted)",
    textDecoration: "none",
  },
});

export default App;
