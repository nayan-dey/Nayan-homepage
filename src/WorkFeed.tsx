import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import { feed, type Built, type FeedTurn } from "./content";
import { ActivityGlyph, ChevronIcon, PlatformIcon, Tile } from "./Icons";

/* Work as one agent session. The prompt, then a steps group (a thought and every activity
   across the three roles) that plays once and folds to a single summary row when done, then
   each role: name, subject, the answer revealed word by word, and stacked marks for the
   things built there that open into a linked list. Prerendered finished and folded; on the
   first visit the client plays it. Reduced motion shows it finished. */

type Item =
  | { kind: "thought" }
  | { kind: "activity"; turn: number; index: number }
  | { kind: "text"; turn: number }
  | { kind: "end" };

const items: Item[] = [
  { kind: "thought" },
  ...feed.turns.flatMap((turn, t) => turn.activities.map((_, index) => ({ kind: "activity", turn: t, index }) as Item)),
  ...feed.turns.map((_, t) => ({ kind: "text", turn: t }) as Item),
  { kind: "end" },
];
const stepCount = items.filter((i) => i.kind === "activity").length;
const indexOf = (kind: Item["kind"], turn = 0, index = 0) =>
  items.findIndex(
    (i) =>
      i.kind === kind &&
      (i.kind !== "activity" || (i.turn === turn && i.index === index)) &&
      (i.kind !== "text" || i.turn === turn),
  );

const THOUGHT_MS = 1000;
const ACTIVITY_MS = 760;
const WORD_MS = 34;

const reduced = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

type StackItem = { name: string; note: string; url: string; logo?: string; tile?: Built["tile"]; icon?: "code"; pad?: boolean };

/* A row of overlapping marks that opens into a list of links. */
function Stack(props: { label: string; items: StackItem[]; title: string }) {
  const [open, setOpen] = createSignal(false);
  let root: HTMLDivElement | undefined;
  const onDoc = (e: Event) => {
    if (root && !root.contains(e.target as Node)) setOpen(false);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  };
  createEffect(
    () => open(),
    (isOpen) => {
      if (!isOpen) return;
      document.addEventListener("pointerdown", onDoc);
      document.addEventListener("keydown", onKey);
      onCleanup(() => {
        document.removeEventListener("pointerdown", onDoc);
        document.removeEventListener("keydown", onKey);
      });
    },
  );
  return (
    <div class="stack-wrap" ref={root}>
      <button
        type="button"
        class="stack-btn"
        aria-expanded={open() ? "true" : "false"}
        aria-haspopup="dialog"
        onClick={() => setOpen(!open())}
      >
        <span class="stack" aria-hidden="true">
          <For each={props.items}>
            {(item) => (
              <span class={"stack-item" + (item.pad ? " pad" : "")}>
                <Show when={item.tile}>{(name) => <Tile name={name()} />}</Show>
                <Show when={item.logo}>
                  <img src={item.logo} alt="" width="22" height="22" decoding="async" />
                </Show>
                <Show when={item.icon}>{(name) => <PlatformIcon name={name()} />}</Show>
              </span>
            )}
          </For>
        </span>
        <span class="stack-label">{props.label}</span>
        <span class="stack-chevron" aria-hidden="true">
          <ChevronIcon />
        </span>
      </button>
      <div class="pop" role="dialog" aria-label={props.title} data-open={open() ? "" : undefined}>
          <ul>
            <For each={props.items}>
              {(item) => (
                <li>
                  <a href={item.url} target="_blank" rel="noopener">
                    <span class={"pop-icon" + (item.pad ? " pad" : "")} aria-hidden="true">
                      <Show when={item.tile}>{(name) => <Tile name={name()} />}</Show>
                      <Show when={item.logo}>
                        <img src={item.logo} alt="" width="24" height="24" decoding="async" />
                      </Show>
                      <Show when={item.icon}>{(name) => <PlatformIcon name={name()} />}</Show>
                    </span>
                    <span class="pop-text">
                      <span class="pop-name">{item.name}</span>
                      <span class="pop-note">{item.note}</span>
                    </span>
                    <span class="pop-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              )}
            </For>
          </ul>
      </div>
    </div>
  );
}

function Words(props: { text: string; shown: () => number }) {
  const words = props.text.split(" ");
  return (
    <For each={words}>
      {(word, i) => (
        <>
          <span class={"w" + (i() < props.shown() ? " on" : "")}>{word}</span>
          {i() < words.length - 1 ? " " : ""}
        </>
      )}
    </For>
  );
}

export default function WorkFeed(props: { active: () => boolean }) {
  // `done` counts finished items; the item at `done` is in progress. Infinity = finished.
  const [done, setDone] = createSignal(Infinity);
  const [words, setWords] = createSignal(Infinity);
  const [stepsOpen, setStepsOpen] = createSignal(false);
  let played = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stepsBody: HTMLDivElement | undefined;
  onCleanup(() => clearTimeout(timer));

  const playing = () => done() !== Infinity;
  const stepsDone = () => items.slice(0, Math.max(0, Math.min(done(), items.length))).filter((i) => i.kind === "activity").length;
  const state = (idx: number) => (idx < done() ? "done" : idx === done() ? "active" : "pending");
  const current = () => (playing() ? items[done()] : undefined);

  function finish() {
    clearTimeout(timer);
    timer = undefined;
    setDone(Infinity);
    setWords(Infinity);
  }

  function step(at: number) {
    if (at >= items.length) return finish();
    const item = items[at];
    setDone(at);
    if (item.kind === "text") {
      const total = feed.turns[item.turn].text.split(" ").length;
      let count = 0;
      setWords(0);
      const tick = () => {
        count += 1;
        setWords(count);
        if (count < total) timer = setTimeout(tick, WORD_MS);
        else timer = setTimeout(() => step(at + 1), 320);
      };
      timer = setTimeout(tick, 200);
      return;
    }
    if (item.kind === "end") return finish();
    const wait = item.kind === "thought" ? THOUGHT_MS * feed.thought.seconds : ACTIVITY_MS;
    timer = setTimeout(() => step(at + 1), wait);
  }

  function play() {
    played = true;
    if (reduced()) return finish();
    clearTimeout(timer);
    setStepsOpen(false);
    setDone(-1);
    setWords(0);
    timer = setTimeout(() => step(0), 360);
  }

  createEffect(
    () => props.active(),
    (active) => {
      if (active && !played) play();
    },
  );

  const summary = () => {
    const item = current();
    if (!item) return "Thought for " + feed.thought.seconds + "s · " + stepCount + " steps";
    if (item.kind === "thought") return "Thinking";
    if (item.kind === "activity") return feed.turns[item.turn].activities[item.index].label;
    return "Writing";
  };
  // The total is not known while a run is going, so the counter only shows what has happened.
  const count = () => {
    const n = stepsDone() + (current()?.kind === "activity" ? 1 : 0);
    return n === 0 ? "" : n + (n === 1 ? " tool call" : " tool calls");
  };

  // Keep the newest row in view while the list is open and the run is adding rows.
  createEffect(
    () => [done(), stepsOpen()] as const,
    ([, open]) => {
      if (!open || !stepsBody) return;
      requestAnimationFrame(() => stepsBody?.scrollTo({ top: stepsBody.scrollHeight, behavior: "smooth" }));
    },
  );

  return (
    <div class="feed" data-playing={playing() ? "" : undefined}>
      <div class="feed-prompt">
        <p>{feed.prompt}</p>
      </div>

      <div class="steps" data-open={stepsOpen() ? "" : undefined}>
        <button
          type="button"
          class="steps-head"
          aria-expanded={stepsOpen() ? "true" : "false"}
          aria-controls="work-steps"
          onClick={() => setStepsOpen(!stepsOpen())}
        >
          <span class="act-icon" aria-hidden="true">
            <ActivityGlyph name="thought" />
          </span>
          <span class={"steps-label" + (playing() ? " shiny" : "")}>{summary()}</span>
          <Show when={playing()}>
            <span class="steps-count">{count()}</span>
          </Show>
          <span class="act-chevron" aria-hidden="true">
            <ChevronIcon />
          </span>
        </button>
        <div class="steps-body" id="work-steps" ref={stepsBody}>
          <details class="act" data-state={state(indexOf("thought"))}>
            <summary>
              <span class="act-icon" aria-hidden="true">
                <ActivityGlyph name="thought" />
              </span>
              <span class="act-label">
                {state(indexOf("thought")) === "active" ? "Thinking" : "Thought for " + feed.thought.seconds + "s"}
              </span>
              <span class="act-chevron" aria-hidden="true">
                <ChevronIcon />
              </span>
            </summary>
            <p class="act-detail">{feed.thought.note}</p>
          </details>
          <For each={feed.turns}>
            {(turn, t) => (
              <For each={turn.activities}>
                {(activity, i) => (
                  <details class="act" data-state={state(indexOf("activity", t(), i()))}>
                    <summary>
                      <span class="act-icon" aria-hidden="true">
                        <ActivityGlyph name={activity.icon} />
                      </span>
                      <span class="act-label">{activity.label}</span>
                      <span class="act-chevron" aria-hidden="true">
                        <ChevronIcon />
                      </span>
                    </summary>
                    <p class="act-detail">{activity.result}</p>
                  </details>
                )}
              </For>
            )}
          </For>
        </div>
      </div>

      <ul class="jobs">
        <For each={feed.turns}>
          {(turn: FeedTurn, t) => (
            <li class="job" data-state={state(indexOf("text", t()))}>
              <div class="mail-row">
                <img class="mail-avatar" src={turn.logo} alt="" width="36" height="36" />
                <span class="mail-from">
                  <span class="mail-name">
                    <a href={turn.url} target="_blank" rel="noopener">
                      {turn.company}
                    </a>
                    <span class={"mail-dot" + (t() === 0 ? " is-live" : "")} aria-hidden="true" />
                  </span>
                  <span class="mail-time">{turn.period}</span>
                </span>
                <span class="mail-subject">{turn.subject}</span>
                <span class="mail-preview">{turn.role}</span>
              </div>
              <p class="answer">
                <Words text={turn.text} shown={() => (state(indexOf("text", t())) === "active" ? words() : Infinity)} />
              </p>
              <div class="job-foot" data-state={state(indexOf("text", t())) === "done" ? "done" : "pending"}>
                <Stack
                  label={turn.builtLabel}
                  title={"Things Nayan built at " + turn.company}
                  items={turn.built.map((b) => ({ name: b.label, note: b.note, url: b.url, logo: b.logo, tile: b.tile, icon: b.icon }))}
                />
              </div>
            </li>
          )}
        </For>
      </ul>

      <Show when={!playing()}>
        <button type="button" class="btn btn-ghost btn-sm feed-replay" onClick={play}>
          Replay
        </button>
      </Show>
    </div>
  );
}
