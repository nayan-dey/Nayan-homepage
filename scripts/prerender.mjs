import { readFile, writeFile, rm } from "node:fs/promises";
import { hydrationScript, prerender } from "../.ssr/entry-server.js";

const shell = await readFile("dist/index.html", "utf8");
const markup = await prerender();
await writeFile(
  "dist/index.html",
  shell
    .replace("</head>", `${hydrationScript()}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`),
);
await rm(".ssr", { recursive: true, force: true });
console.log("Prerendered portfolio: readable HTML before JavaScript loads.");
