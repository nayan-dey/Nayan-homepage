import { hydrate, render } from "@solidjs/web";
import App from "./App";
import "./global.css";

const root = document.getElementById("root")!;
if (root.hasChildNodes()) hydrate(() => <App />, root);
else render(() => <App />, root);
