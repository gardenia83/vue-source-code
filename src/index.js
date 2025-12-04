import { render } from "@/runtime-dom/index.js";
import { h } from "@/runtime-core/h.js";
const app = document.querySelector("#app");
render(h("div", "hello world"), app);
