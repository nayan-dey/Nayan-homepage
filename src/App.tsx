import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import { about, coreSkills, intro, person, safeguard, socials } from "./content";
import { CheckIcon, ChevronIcon, CopyIcon, MoonIcon, SunIcon } from "./Icons";
import WorkFeed from "./WorkFeed";
import { SkillGlyph } from "./SkillIcons";
import { ConceptGlyph } from "./Icons";
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
const EXIT_MS = 130;
const ENTER_MS = 300;
const ENTER_TRAVEL = 28;
const SWIPE_TRAVEL = 56;
const SWIPE_COMMIT = 0.32;
const SWIPE_FLICK = 0.55; // px per ms
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const THEME_COLOR: Record<Theme, string> = { light: "#f5e9dc", dark: "#101113" };

const order = (id: ViewId) => views.findIndex((v) => v.id === id);

function viewFromHash(hash: string): ViewId {
  const id = hash.replace(/^#\/?/, "");
  return views.some((v) => v.id === id) ? (id as ViewId) : "home";
}

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

  // The views block keeps its height across a change so the footer glides instead of
  // jumping: the old height is measured before the swap and animated to the new one.
  let heightFrom: number | undefined;
  let heightAnim: Animation | undefined;

  function commit() {
    swapTimer = undefined;
    if (selectedId === shownId) return;
    heightFrom = viewsEl?.offsetHeight;
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
      if (viewsEl && heightFrom !== undefined) {
        const h0 = heightFrom;
        heightFrom = undefined;
        heightAnim?.cancel();
        viewsEl.style.minHeight = "";
        const h1 = viewsEl.offsetHeight;
        if (Math.abs(h1 - h0) > 1 && !reducedMotion()) {
          heightAnim = viewsEl.animate([{ minHeight: h0 + "px" }, { minHeight: h1 + "px" }], {
            duration: ENTER_MS + 60,
            easing: EASE_OUT,
          });
        }
      }
      const el = panelEls[view];
      if (!animateEnter || !el) return;
      animateEnter = false;
      enterAnimation = el.animate(
        [
          {
            opacity: 0,
            transform: "translateX(" + enterDir * ENTER_TRAVEL + "px)",
            filter: "blur(8px)",
          },
          { opacity: 1, transform: "none", filter: "blur(0)" },
        ],
        { duration: ENTER_MS, easing: EASE_OUT },
      );
      enterAnimation.onfinish = () => (enterAnimation = undefined);
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
      try {
        if (sessionStorage.getItem("swiped")) document.documentElement.dataset.swiped = "";
      } catch {
        /* storage unavailable */
      }

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
  // Swipe between views with a finger or pen. The panel follows the drag: it slides, fades
  // and blurs in proportion to the distance while the neighbour slides in from the far side,
  // so the motion is driven by the hand, not a timer. Letting go past a third of the width,
  // or a flick, commits; otherwise both settle back. At the first or last view the panel
  // only gives a little, like a rubber band.
  type Drag = {
    id: number;
    x0: number;
    y0: number;
    w: number;
    active: boolean;
    dir: 1 | -1;
    target?: ViewId;
    lastX: number;
    lastT: number;
    v: number;
    p: number;
  };
  let drag: Drag | undefined;
  let settle: Animation[] = [];

  const neighbour = (dir: 1 | -1): ViewId | undefined => views[order(shownId) + dir]?.id;

  function styleDrag(p: number) {
    if (!drag) return;
    const cur = panelEls[shownId];
    const tgt = drag.target ? panelEls[drag.target] : undefined;
    const sign = -drag.dir;
    if (!cur) return;
    if (!tgt) {
      cur.style.transform = "translateX(" + sign * p * drag.w * 0.16 + "px)";
      return;
    }
    // The underline moves between the two tabs with the finger.
    const a = tabEls[shownId];
    const b = drag.target ? tabEls[drag.target] : undefined;
    if (a && b && indicator) {
      indicator.classList.add("is-instant");
      indicator.style.setProperty("--x", a.offsetLeft + (b.offsetLeft - a.offsetLeft) * p + "px");
      indicator.style.setProperty("--w", a.offsetWidth + (b.offsetWidth - a.offsetWidth) * p + "px");
    }
    const fade = Math.min(1, p * 1.25);
    cur.style.transform = "translateX(" + sign * p * SWIPE_TRAVEL + "px)";
    cur.style.opacity = String(1 - fade);
    cur.style.filter = "blur(" + (p * 8).toFixed(2) + "px)";
    tgt.style.transform = "translateX(" + -sign * (1 - p) * SWIPE_TRAVEL + "px)";
    tgt.style.opacity = String(fade);
    tgt.style.filter = "blur(" + ((1 - p) * 8).toFixed(2) + "px)";
  }

  function clearDragStyles(el?: HTMLElement) {
    if (!el) return;
    el.style.transform = "";
    el.style.opacity = "";
    el.style.filter = "";
    el.style.position = "";
    el.style.inset = "";
    el.style.display = "";
    el.style.pointerEvents = "";
  }

  function onViewsPointerDown(event: PointerEvent) {
    if (event.pointerType === "mouse" || !event.isPrimary || swapTimer || drag) return;
    if (enterAnimation && enterAnimation.playState === "running") return;
    const el = viewsEl;
    if (!el) return;
    drag = {
      id: event.pointerId,
      x0: event.clientX,
      y0: event.clientY,
      w: el.clientWidth,
      active: false,
      dir: 1,
      lastX: event.clientX,
      lastT: event.timeStamp,
      v: 0,
      p: 0,
    };
  }

  function onViewsPointerMove(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x0;
    const dy = event.clientY - drag.y0;
    if (!drag.active) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        drag = undefined; // a vertical scroll
        return;
      }
      if (Math.abs(dx) < 12) return;
      drag.active = true;
      drag.dir = dx < 0 ? 1 : -1;
      drag.target = neighbour(drag.dir);
      settle.forEach((a) => a.cancel());
      settle = [];
      viewsEl?.setPointerCapture(event.pointerId);
      viewsEl?.setAttribute("data-dragging", "");
      const tgt = drag.target ? panelEls[drag.target] : undefined;
      if (tgt) {
        tgt.style.display = "block";
        tgt.style.position = "absolute";
        tgt.style.inset = "0 0 auto 0";
        tgt.style.pointerEvents = "none";
        // Hold the taller of the two heights so the footer stays put while dragging.
        if (viewsEl) {
          heightAnim?.cancel();
          viewsEl.style.minHeight = Math.max(viewsEl.offsetHeight, tgt.offsetHeight) + "px";
        }
      }
    }
    if ((dx < 0 && drag.dir !== 1) || (dx > 0 && drag.dir !== -1)) {
      // Reversed past the start: hold at rest in this direction.
      drag.p = 0;
      styleDrag(0);
      return;
    }
    const dt = Math.max(1, event.timeStamp - drag.lastT);
    drag.v = (event.clientX - drag.lastX) / dt;
    drag.lastX = event.clientX;
    drag.lastT = event.timeStamp;
    drag.p = Math.min(1, Math.abs(dx) / drag.w);
    styleDrag(drag.p);
  }

  function onViewsPointerEnd(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.id) return;
    const d = drag;
    drag = undefined;
    if (!d.active) return;
    viewsEl?.removeAttribute("data-dragging");
    const cur = panelEls[shownId];
    const tgt = d.target ? panelEls[d.target] : undefined;
    const sign = -d.dir;
    const flick = Math.abs(d.v) > SWIPE_FLICK && Math.sign(d.v) === sign;
    const commitSwipe = !!tgt && event.type !== "pointercancel" && (d.p > SWIPE_COMMIT || flick);
    const ms = reducedMotion() ? 0 : commitSwipe ? 240 : 280;
    if (!cur) return;
    // Let the underline glide to its resting place from wherever the finger left it.
    if (indicator && d.target) {
      indicator.classList.remove("is-instant");
      const to = tabEls[commitSwipe ? d.target : shownId];
      if (to) {
        indicator.style.setProperty("--x", to.offsetLeft + "px");
        indicator.style.setProperty("--w", to.offsetWidth + "px");
      }
    }
    if (commitSwipe && tgt && d.target) {
      const target = d.target;
      document.documentElement.dataset.swiped = "";
      try {
        sessionStorage.setItem("swiped", "1");
      } catch {
        /* storage unavailable */
      }
      const a = cur.animate(
        [{ transform: "translateX(" + sign * SWIPE_TRAVEL * 1.4 + "px)", opacity: 0, filter: "blur(8px)" }],
        { duration: ms, easing: EASE_OUT, fill: "forwards" },
      );
      const b = tgt.animate([{ transform: "none", opacity: 1, filter: "blur(0)" }], {
        duration: ms,
        easing: EASE_OUT,
        fill: "forwards",
      });
      settle = [a, b];
      b.onfinish = () => {
        settle = [];
        a.cancel();
        b.cancel();
        clearDragStyles(cur);
        clearDragStyles(tgt);
        cur.style.display = "none";
        tgt.style.display = "block";
        select(target, { instant: true });
        requestAnimationFrame(() => {
          cur.style.display = "";
          tgt.style.display = "";
        });
      };
      return;
    }
    const a = cur.animate([{ transform: "none", opacity: 1, filter: "blur(0)" }], {
      duration: ms,
      easing: EASE_OUT,
      fill: "forwards",
    });
    const list = [a];
    if (tgt) {
      list.push(
        tgt.animate(
          [{ transform: "translateX(" + -sign * SWIPE_TRAVEL + "px)", opacity: 0, filter: "blur(8px)" }],
          { duration: ms, easing: EASE_OUT, fill: "forwards" },
        ),
      );
    }
    settle = list;
    a.onfinish = () => {
      settle = [];
      list.forEach((x) => x.cancel());
      clearDragStyles(cur);
      clearDragStyles(tgt);
      if (viewsEl) viewsEl.style.minHeight = "";
    };
  }

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

      <main
        id="main"
        class="views"
        tabindex={-1}
        ref={viewsEl}
        onPointerDown={onViewsPointerDown}
        onPointerMove={onViewsPointerMove}
        onPointerUp={onViewsPointerEnd}
        onPointerCancel={onViewsPointerEnd}
      >
        <section
          id="panel-home"
          class={panelClass("home")}
          role="tabpanel"
          tabindex={0}
          aria-labelledby="tab-home"
          ref={(el) => (panelEls.home = el)}
        >
          <div class="hero">
            <div class="swipe-hint" aria-hidden="true">
              <span class="swipe-hint-pill">
                <ChevronIcon />
                Swipe
              </span>
            </div>
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
            <p>Three roles, read the way my agents would.</p>
          </div>
          <WorkFeed active={() => shown() === "work"} />
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
            <p>What I reach for every day.</p>
          </div>
          <dl class="skills">
            <For each={coreSkills}>
              {(group) => (
                <div class="skill-group">
                  <dt>{group.label}</dt>
                  <dd>
                    <ul class="chips chips-static">
                      <For each={group.skills}>
                        {(skill) => (
                          <li>
                            <Show when={skill.glyph}>
                              <span class="chip-glyph" aria-hidden="true">
                                <SkillGlyph name={skill.glyph!} />
                              </span>
                            </Show>
                            <Show when={skill.concept}>
                              <span class="chip-glyph" aria-hidden="true">
                                <ConceptGlyph name={skill.concept!} />
                              </span>
                            </Show>
                            <Show when={skill.img}>
                              <img src={skill.img} alt="" width="16" height="16" loading="lazy" decoding="async" />
                            </Show>
                            {skill.name}
                          </li>
                        )}
                      </For>
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
                class="btn btn-ghost copy"
                data-state={copyState()}
                onClick={copyEmail}
                disabled={copyState() === "copying"}
                aria-label={copyState() === "copied" ? "Email copied" : "Copy email address"}
                title="Copy email address"
              >
                <span class="copy-icon">
                  <CopyIcon />
                  <CheckIcon />
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
        <span class="foot-name">
          {person.name}
          <span class="foot-sep" aria-hidden="true">
            ·
          </span>
          {new Date().getFullYear()}
        </span>
        <nav class="foot-links" aria-label="Footer">
          <a href="https://github.com/nayan-dey/Nayan-homepage" target="_blank" rel="noopener">
            <SocialIcon name="GitHub" />
            Source
          </a>
          <a href={mailto}>Email</a>
        </nav>
      </footer>
    </div>
  );
}
