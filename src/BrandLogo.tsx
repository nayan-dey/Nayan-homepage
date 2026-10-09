import { createEffect, onCleanup } from "solid-js";
import "./BrandLogo.css";

// Identity 03, "one N to NAYAN". Every letter rests on the mirror axis, so the bar shows a
// single N. On hover (or once on arrival) the word grows from the middle outward: the N's
// part, Y appears on the axis, the A's follow, and the N's settle last at the ends. Closing
// runs in the opposite order. Geometry matches public/logo-lab.html.
const N_STEMS = (
  <>
    <polygon points="0,6.976 20,41.459 20,100 0,100" />
    <polygon points="82,93.024 62,58.541 62,0 82,0" />
    <polygon points="0,0 24,0 82,100 58,100" />
  </>
);
const A_SHAPE = "0,100 36,0 58,0 94,100 71,100 47,33.333 23,100";
const Y_SHAPE = "0,0 24,0 47,34.811 70,0 94,0 57,56 57,100 37,100 37,56";

// --rest centres the letter on the axis (x 205); --final is its place in the word.
// --ko / --kc are the stagger steps when opening and closing.
const N_LEFT = { "--rest": "164px", "--final": "0px", "--ko": 0, "--kc": 2 };
const A_LEFT = { "--rest": "158px", "--final": "87px", "--ko": 1, "--kc": 1 };
const Y_MID = { "--rest": "158px", "--final": "158px", "--ko": 2, "--kc": 0 };
const A_RIGHT = { "--rest": "158px", "--final": "229px", "--ko": 1, "--kc": 1 };
const N_RIGHT = { "--rest": "164px", "--final": "328px", "--ko": 0, "--kc": 2 };

const HOLD_MS = 1400;
let arrived = false; // the arrival plays once per page, whatever remounts

export default function BrandLogo() {
  let mark: SVGSVGElement | undefined;
  let firstFrame = 0;
  let secondFrame = 0;
  let holdTimer = 0;

  createEffect(
    () => undefined,
    () => {
      // Arrival: let the prerendered single N paint, open the name once, then fold it back.
      if (arrived) return;
      arrived = true;
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          mark?.setAttribute("data-open", "");
          holdTimer = window.setTimeout(() => mark?.removeAttribute("data-open"), HOLD_MS);
        });
      });
    },
  );
  onCleanup(() => {
    if (firstFrame) cancelAnimationFrame(firstFrame);
    if (secondFrame) cancelAnimationFrame(secondFrame);
    if (holdTimer) clearTimeout(holdTimer);
  });

  function toggleOnTouch(event: PointerEvent) {
    if (event.pointerType === "mouse" || !event.isPrimary) return;
    mark?.toggleAttribute("data-open");
  }

  return (
    <svg
      class="brand-logo"
      viewBox="0 0 410 100"
      width="98.4"
      height="24"
      fill="currentColor"
      aria-hidden="true"
      ref={mark}
      onPointerUp={toggleOnTouch}
    >
      <g class="brand-l" style={N_LEFT}>
        {N_STEMS}
      </g>
      <g class="brand-l brand-mid" style={A_LEFT}>
        <polygon points={A_SHAPE} />
      </g>
      <g class="brand-l brand-mid" style={Y_MID}>
        <polygon points={Y_SHAPE} />
      </g>
      <g class="brand-l brand-mid" style={A_RIGHT}>
        <polygon points={A_SHAPE} />
      </g>
      <g class="brand-l" style={N_RIGHT}>
        {N_STEMS}
      </g>
    </svg>
  );
}
