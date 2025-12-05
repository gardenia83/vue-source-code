import { render } from "@/runtime-dom/index.js";
import { h } from "@/runtime-core/h.js";
const app = document.querySelector("#app");
render(
  h("div", [h("p", null, "hello world"), h("p", null, "hello world")]),
  app
);
// render(h("div", "vue3"), app);
setTimeout(() => {
  render(h("div"), app);
}, 2000);
