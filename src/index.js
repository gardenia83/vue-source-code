import { render } from "@/runtime-dom/index.js";
import { h } from "@/runtime-core/h.js";
const app = document.querySelector("#app");
render(
  h("ul", [
    h("li", { key: "a", style: { background: "red" } }, "a"),
    h("li", { key: "b" }, "b"),
    h("li", { key: "c" }, "c"),
    h("li", { key: "d" }, "d"),
    h("li", { key: "e" }, "e"),
    h("li", { key: "f" }, "f"),
    h("li", { key: "g" }, "g"),
  ]),
  app
);
// render(h("div", "vue3"), app);
setTimeout(() => {
  render(
    h("ul", [
      h("li", { key: "a", style: { background: "orange" } }, "a"),
      h("li", { key: "b" }, "b"),
      h("li", { key: "e" }, "e"),
      h("li", { key: "c" }, "c"),
      h("li", { key: "d" }, "d"),
      h("li", { key: "h" }, "h"),
      h("li", { key: "f" }, "f"),
      h("li", { key: "g" }, "g"),
    ]),
    app
  );
}, 2000);
