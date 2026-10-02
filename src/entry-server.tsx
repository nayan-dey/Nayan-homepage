import { generateHydrationScript, renderToString } from "@solidjs/web";
import App from "./App";

export const prerender = () => renderToString(() => <App />);
export const hydrationScript = () => generateHydrationScript();
