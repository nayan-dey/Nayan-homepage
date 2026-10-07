import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import { about, coreSkills, intro, person, previousWork, safeguard, socials } from "./content";
import { MoonIcon, PlatformIcon, SunIcon, type PlatformIconName } from "./Icons";
import { SocialIcon } from "./SocialIcons";
import BrandLogo from "./BrandLogo";

// Store screenshots in public/projects are kept on disk but no longer shown on the page.

type ViewId = "home" | "work" | "about" | "contact";
type Theme = "light" | "dark";

const views: { id: ViewId; label: string; href: string }[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "work", label: "Work", href: "#work" },
  { id: "about", label: "About", href: "#about" },
  { id: "contact", label: "Contact", href: "#contact" },
];

// Motion: the leaving panel fades and slides for EXIT_MS, then the next one settles in over
// ENTER_MS. Direction follows the tab order: a later tab arrives from the right, an earlier
// one from the left. The sign is taken from the panel on screen, not the last selection.
const EXIT_MS = 110;
const ENTER_MS = 220;
const ENTER_TRAVEL = 24;
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const THEME_COLOR: Record<Theme, string> = { light: "#f5e9dc", dark: "#101113" };

const order = (id: ViewId) => views.findIndex((v) => v.id === id);

function viewFromHash(hash: string): ViewId {
  const id = hash.replace(/^#\/?/, "");
  return views.some((v) => v.id === id) ? (id as ViewId) : "home";
}

const platformIcons: Record<string, PlatformIconName> = {
  Web: "web",
  Desktop: "desktop",
  CLI: "cli",
  MCP: "mcp",
};

function Socials() {
  return (
    <ul class="social" aria-label="Social profiles">
      <For each={socials}>
        {(s) => (
          <li>
            <a href={s.url} target="_blank" rel="me noopener" aria-label={s.name}>
              <SocialIcon name={s.name} />
            </a>
          </li>
        )}
      </For>
    </ul>
  );
}

function Chip(props: {
  href: string;
  label: string;
  icon?: PlatformIconName;
  logo?: string;
  ariaLabel?: string;
}) {
  return (
    <a class="chip" href={props.href} target="_blank" rel="noopener" aria-label={props.ariaLabel}>
      <Show when={props.icon}>{(name) => <PlatformIcon name={name()} />}</Show>
      <Show when={props.logo}>
        <img src={props.logo} alt="" width="16" height="16" loading="lazy" decoding="async" />
      </Show>
      {props.label}
    </a>
  );
}

export default function App() {
  // Views. `selected` is the tab state and drives the URL; `shown` is the panel on screen.
  const [selected, setSelected] = createSignal<ViewId>("home");
  const [shown, setShown] = createSignal<ViewId>("home");
  const [theme, setTheme] = createSignal<Theme>("dark");
  const [copyState, setCopyState] = createSignal<"idle" | "copying" | "copied" | "failed">("idle");

  const tabEls: Partial<Record<ViewId, HTMLAnchorElement>> = {};
  const panelEls: Partial<Record<ViewId, HTMLElement>> = {};
  let tabList: HTMLElement | undefined;
  let viewsEl: HTMLElement | undefined;
  let indicator: HTMLSpanElement | undefined;
  let swapTimer: ReturnType<typeof setTimeout> | undefined;
  let copyTimer: ReturnType<typeof setTimeout> | undefined;
  let enterAnimation: Animation | undefined;
  let instant = false;
  let animateEnter = false;
  let enterDir: 1 | -1 = 1;
  let currentTheme: Theme = "dark";
  let themeOverride: Theme | null = null;
  onCleanup(() => {
    clearTimeout(swapTimer);
    clearTimeout(copyTimer);
    enterAnimation?.cancel();
  });

  const reducedMotion = () =>
    typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function syncHistory(next: ViewId) {
    if (viewFromHash(location.hash) === next) return;
    history.pushState(null, "", next === "home" ? location.pathname + location.search : "#" + next);
  }

  // Solid 2 signal reads stay stale until the batch flushes, so the logic below keeps
  // plain mirrors of the two signals and the signals only drive rendering.
  let selectedId: ViewId = "home";
  let shownId: ViewId = "home";

  // +1 when `next` sits to the right of the panel on screen, -1 when it sits to the left.
  const directionTo = (next: ViewId): 1 | -1 => (order(next) > order(shownId) ? 1 : -1);

  function commit() {
    swapTimer = undefined;
    if (selectedId === shownId) return;
    animateEnter = !instant && !reducedMotion();
    enterDir = directionTo(selectedId);
    shownId = selectedId;
    setShown(shownId);
    if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }

  // Pointer changes slide the old panel out and the new one in from the opposite side.
  // Keyboard and reduced-motion changes are instant. A new choice mid-transition simply
  // retargets: the exit transition follows the updated direction attribute.
  function select(next: ViewId, opts: { push?: boolean; instant?: boolean } = {}) {
    if (opts.push !== false) syncHistory(next);
    if (next === selectedId) {
      if (opts.instant || reducedMotion()) {
        instant = true;
        animateEnter = false;
        enterAnimation?.cancel();
        clearTimeout(swapTimer);
        commit();
        updateIndicator(true);
      }
      return;
    }
    instant = !!opts.instant;
    selectedId = next;
    setSelected(next);
    animateEnter = false;
    if (instant || reducedMotion()) {
      enterAnimation?.cancel();
      clearTimeout(swapTimer);
      commit();
      return;
    }
    // Retarget the CSS exit transition naturally; only cancel our entry animation.
    enterAnimation?.cancel();
    if (next === shownId) {
      clearTimeout(swapTimer);
      swapTimer = undefined;
      return;
    }
    viewsEl?.setAttribute("data-dir", directionTo(next) === 1 ? "next" : "prev");
    if (!swapTimer) swapTimer = setTimeout(commit, EXIT_MS);
  }

  function onTabKey(event: KeyboardEvent) {
    if (event.key === " " || event.key === "Enter") {
      const tab = (event.target as HTMLElement).closest<HTMLAnchorElement>("[role=tab]");
      const view = views.find((v) => tab?.id === "tab-" + v.id);
      if (view) {
        event.preventDefault();
        tabList?.setAttribute("data-keyboard", "");
        select(view.id, { instant: true });
      }
      return;
    }
    const focusedTab = (event.target as HTMLElement).closest<HTMLAnchorElement>("[role=tab]");
    const focusedIndex = views.findIndex((v) => focusedTab?.id === "tab-" + v.id);
    const index = focusedIndex < 0 ? views.findIndex((v) => v.id === selectedId) : focusedIndex;
    let target = -1;
    if (event.key === "ArrowRight") target = (index + 1) % views.length;
    else if (event.key === "ArrowLeft") target = (index - 1 + views.length) % views.length;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = views.length - 1;
    if (target < 0) return;
    event.preventDefault();
    tabList?.setAttribute("data-keyboard", "");
    const id = views[target].id;
    tabEls[id]?.focus();
    select(id, { instant: true });
  }

  function placeIndicator() {
    const el = tabEls[selectedId];
    if (!el || !indicator) return;
    indicator.style.setProperty("--x", el.offsetLeft + "px");
    indicator.style.setProperty("--w", el.offsetWidth + "px");
  }

  function updateIndicator(immediate: boolean) {
    if (!indicator) return;
    indicator.classList.toggle("is-instant", immediate);
    placeIndicator();
    if (immediate) {
      // Commit the new geometry before restoring transitions on the next frame.
      void indicator.offsetWidth;
      requestAnimationFrame(() => indicator?.classList.remove("is-instant"));
    }
  }

  createEffect(
    () => selected(),
    () => updateIndicator(instant),
  );

  createEffect(
    () => shown(),
    (view) => {
      document.documentElement.dataset.view = view;
      enterAnimation?.cancel();
      enterAnimation = undefined;
      const el = panelEls[view];
      if (!animateEnter || !el) return;
      animateEnter = false;
      enterAnimation = el.animate(
        [
          {
            opacity: 0,
            transform: "translateX(" + enterDir * ENTER_TRAVEL + "px)",
            filter: "blur(4px)",
          },
          { opacity: 1, transform: "none", filter: "blur(0)" },
        ],
        { duration: ENTER_MS, easing: EASE_OUT },
      );
    },
  );

  // The early script sets the theme before paint. Follow the OS until a visitor
  // chooses a theme; keep that choice across reloads and subsequent OS changes.
  const systemTheme = (): Theme =>
    matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  function applyTheme(next: Theme) {
    const style = document.createElement("style");
    style.textContent = "*:not(.keep-motion),*::before,*::after{transition:none!important}";
    document.head.append(style);
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[next]);
    currentTheme = next;
    setTheme(next);
    void document.body.offsetHeight;
    requestAnimationFrame(() => requestAnimationFrame(() => style.remove()));
  }

  function toggleTheme() {
    const next: Theme = currentTheme === "dark" ? "light" : "dark";
    themeOverride = next;
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable: the choice lasts for this page */
    }
  }

  createEffect(
    () => undefined,
    () => {
      currentTheme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
      setTheme(currentTheme);
      try {
        const stored = localStorage.getItem("theme");
        if (stored === "light" || stored === "dark") themeOverride = stored;
      } catch {
        /* storage unavailable: use the current page's preference */
      }
      const initial = viewFromHash(location.hash);
      if (initial !== "home") {
        selectedId = shownId = initial;
        setSelected(initial);
        setShown(initial);
      }
      history.scrollRestoration = "auto";

      const onPop = () => select(viewFromHash(location.hash), { push: false });
      const scheme = matchMedia("(prefers-color-scheme: dark)");
      const onScheme = () => {
        if (!themeOverride) applyTheme(systemTheme());
      };
      window.addEventListener("popstate", onPop);
      scheme.addEventListener("change", onScheme);

      const ro = new ResizeObserver(placeIndicator);
      if (tabList) ro.observe(tabList);
      document.fonts?.ready.then(placeIndicator);
      requestAnimationFrame(() => tabList?.classList.add("is-ready"));

      const booted = setTimeout(() => (document.documentElement.dataset.booted = ""), 900);
      return () => {
        window.removeEventListener("popstate", onPop);
        scheme.removeEventListener("change", onScheme);
        ro.disconnect();
        clearTimeout(booted);
      };
    },
  );

  async function copyEmail() {
    if (copyState() === "copying") return;
    clearTimeout(copyTimer);
    const previous = document.activeElement as HTMLElement | null;
    setCopyState("copying");
    let success = false;
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error();
      await navigator.clipboard.writeText(person.email);
      success = true;
    } catch {
      const input = document.createElement("textarea");
      input.value = person.email;
      input.style.cssText = "position:fixed;opacity:0;font-size:16px;top:0;left:0";
      document.body.append(input);
      try {
        input.focus({ preventScroll: true });
        input.select();
        input.setSelectionRange(0, input.value.length);
        success = document.execCommand("copy");
      } catch {
        success = false;
      } finally {
        input.remove();
      }
    }
    setCopyState(success ? "copied" : "failed");
    // Wait until the pending state releases the button, and preserve any focus
    // the visitor moved elsewhere while the clipboard request was in flight.
    requestAnimationFrame(() => {
      if (document.activeElement === document.body && previous?.isConnected && previous.getClientRects().length) {
        previous.focus({ preventScroll: true });
      }
    });
    if (success) {
      copyTimer = setTimeout(() => setCopyState("idle"), 2400);
    }
  }

  const mailto = "mailto:" + person.email;
  const panelClass = (id: ViewId) =>
    "panel" + (shown() === id && selected() !== id ? " is-leaving" : "");
  const viewLink = (id: ViewId) => (event: MouseEvent) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    select(id, { instant: event.detail === 0 });
  };

  function skipToContent(event: MouseEvent) {
    event.preventDefault();
    const main = document.getElementById("main");
    main?.focus({ preventScroll: true });
    main?.scrollIntoView({ block: "start", behavior: "instant" as ScrollBehavior });
  }

  return (
    <div class="page">
      <a class="skip" href="#main" onClick={skipToContent}>
        Skip to content
      </a>

      <header class="bar">
        <div class="bar-inner">
          <a class="wordmark" href="/" aria-label={person.name + ", Home"} onClick={viewLink("home")}>
            <BrandLogo />
          </a>
          <nav
            class="nav"
            aria-label="Pages"
            role="tablist"
            ref={tabList}
            onKeyDown={onTabKey}
            onPointerDown={() => tabList?.removeAttribute("data-keyboard")}
          >
            <span class="nav-indicator" ref={indicator} aria-hidden="true" />
            <For each={views}>
              {(v) => (
                <a
                  id={"tab-" + v.id}
                  class="tab"
                  role="tab"
                  href={v.href}
                  aria-selected={selected() === v.id ? "true" : "false"}
                  aria-controls={"panel-" + v.id}
                  tabindex={selected() === v.id ? 0 : -1}
                  ref={(el) => (tabEls[v.id] = el)}
                  onClick={viewLink(v.id)}
                >
                  {v.label}
                </a>
              )}
            </For>
          </nav>
          <button
            type="button"
            class="theme"
            onClick={toggleTheme}
            aria-label={theme() === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            <span class="theme-icon theme-sun keep-motion">
              <SunIcon />
            </span>
            <span class="theme-icon theme-moon keep-motion">
              <MoonIcon />
            </span>
          </button>
        </div>
      </header>

      <main id="main" class="views" tabindex={-1} ref={viewsEl}>
        <section
          id="panel-home"
          class={panelClass("home")}
          role="tabpanel"
          tabindex={0}
          aria-labelledby="tab-home"
          ref={(el) => (panelEls.home = el)}
        >
          <div class="hero">
            <h1 class="role">
              {person.role} at{" "}
              <a href={safeguard.url} target="_blank" rel="noopener">
                {safeguard.name}
              </a>
            </h1>
            <div class="intro">
              <For each={intro}>{(text) => <p>{text}</p>}</For>
            </div>
            <div class="hero-actions">
              <a class="btn btn-primary" href={mailto}>
                Email me
              </a>
              <a class="btn btn-secondary" href="#work" onClick={viewLink("work")}>
                See work
              </a>
              <Socials />
            </div>
          </div>
        </section>

        <section
          id="panel-work"
          class={panelClass("work")}
          role="tabpanel"
          tabindex={0}
          aria-labelledby="tab-work"
          ref={(el) => (panelEls.work = el)}
        >
          <div class="section-head">
            <h2>Work</h2>
            <p>From ordering and checkout flows to the systems that run AI agents.</p>
          </div>

          <ol class="rows">
            <li class="row">
              <div class="row-head">
                <img src={safeguard.logo} alt="" width="28" height="28" />
                <h3>
                  <a href={safeguard.url} target="_blank" rel="noopener">
                    {safeguard.name}
                  </a>
                  <span>Founding engineer</span>
                </h3>
                <span class="when">Now</span>
              </div>
              <p>
                {safeguard.description} {safeguard.summary}
              </p>
              <ul class="notes">
                <For each={safeguard.highlights}>{(note) => <li>{note}</li>}</For>
              </ul>
              <ul class="chips" aria-label="Safeguard platforms">
                <For each={safeguard.platforms}>
                  {(platform) => (
                    <Show
                      when={"url" in platform && platform.url}
                      fallback={
                        <>
                          <li>
                            <Chip
                              href={(platform as any).ios}
                              label="iOS"
                              icon="ios"
                              ariaLabel="Safeguard for iOS on the App Store"
                            />
                          </li>
                          <li>
                            <Chip
                              href={(platform as any).android}
                              label="Android"
                              icon="android"
                              ariaLabel="Safeguard for Android on Google Play"
                            />
                          </li>
                        </>
                      }
                    >
                      <li>
                        <Chip
                          href={(platform as any).url}
                          label={platform.name}
                          icon={platformIcons[platform.name]}
                          ariaLabel={"Safeguard " + platform.name + ": " + platform.description}
                        />
                      </li>
                    </Show>
                  )}
                </For>
                <li>
                  <Chip
                    href="https://docs.safeguard.sh"
                    label="Docs"
                    icon="docs"
                    ariaLabel="Safeguard documentation"
                  />
                </li>
              </ul>
            </li>

            <For each={previousWork}>
              {(company) => (
                <li class="row">
                  <div class="row-head">
                    <img src={company.logo} alt="" width="28" height="28" />
                    <h3>
                      <a href={company.url} target="_blank" rel="noopener">
                        {company.name}
                      </a>
                      <span>{company.role}</span>
                    </h3>
                    <span class="when">{company.period}</span>
                  </div>
                  <p>{company.description}</p>
                  <ul class="notes">
                    <For each={company.highlights}>{(note) => <li>{note}</li>}</For>
                  </ul>
                  <ul class="chips" aria-label={company.name + " projects"}>
                    <For each={company.projects}>
                      {(project) => (
                        <li>
                          <Chip
                            href={project.url}
                            label={project.name}
                            logo={"logo" in project ? project.logo : undefined}
                            icon={"icon" in project ? project.icon : undefined}
                            ariaLabel={project.name + ", " + project.kind.toLowerCase()}
                          />
                        </li>
                      )}
                    </For>
                  </ul>
                </li>
              )}
            </For>
          </ol>
        </section>

        <section
          id="panel-about"
          class={panelClass("about")}
          role="tabpanel"
          tabindex={0}
          aria-labelledby="tab-about"
          ref={(el) => (panelEls.about = el)}
        >
          <div class="section-head">
            <h2>About</h2>
            <p>Based in {person.location}.</p>
          </div>
          <div class="prose">
            <For each={about}>{(text) => <p>{text}</p>}</For>
          </div>
          <div class="section-head skills-head">
            <h2>Skills</h2>
            <p>Tools and systems I've used in shipped work.</p>
          </div>
          <dl class="skills">
            <For each={coreSkills}>
              {(group) => (
                <div class="skill-group">
                  <dt>{group.label}</dt>
                  <dd>
                    <ul class="chips chips-static">
                      <For each={group.skills}>{(skill) => <li>{skill}</li>}</For>
                    </ul>
                  </dd>
                </div>
              )}
            </For>
          </dl>
        </section>

        <section
          id="panel-contact"
          class={panelClass("contact")}
          role="tabpanel"
          tabindex={0}
          aria-labelledby="tab-contact"
          ref={(el) => (panelEls.contact = el)}
        >
          <div class="section-head">
            <h2>Contact</h2>
            <p>Get in touch about a role, a project or something I've built.</p>
          </div>
          <div class="contact">
            <div class="address">
              <a class="email" href={mailto}>
                {person.email}
              </a>
              <button
                type="button"
                class="btn btn-secondary copy"
                data-state={copyState()}
                onClick={copyEmail}
                disabled={copyState() === "copying"}
              >
                <span class="copy-labels">
                  <span>Copy</span>
                  <span>Copying</span>
                  <span>Copied</span>
                </span>
              </button>
            </div>
            <span class="sr" role="status">{copyState() === "copied" ? "Email copied" : ""}</span>
            <Show when={copyState() === "failed"}>
              <p class="copy-feedback" role="status">
                Copying is not available here. Select the address above to copy it.
              </p>
            </Show>
            <p class="contact-note">Elsewhere</p>
            <Socials />
          </div>
        </section>
      </main>

      <footer class="foot">
        <span>{person.name}</span>
        <a href="https://github.com/nayan-dey/Nayan-homepage" target="_blank" rel="noopener">
          Source on GitHub
        </a>
      </footer>
    </div>
  );
}
