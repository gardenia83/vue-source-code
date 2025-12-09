import { render } from "@/runtime-dom/index.js";
import { Fragment, Text, h } from "@/runtime-core";
const app = document.querySelector("#app");
// render(
//   h("ul", [
//     h("li", { key: "a", style: { background: "red" } }, "a"),
//     h("li", { key: "b" }, "b"),
//     h("li", { key: "c" }, "c"),
//     h("li", { key: "d" }, "d"),
//     h("li", { key: "e" }, "e"),
//     h("li", { key: "f" }, "f"),
//     h("li", { key: "g" }, "g"),
//   ]),
//   app
// );
render(
  h(Fragment, [
    h("div", h("h1", null, "Hello vue3")),
    h("div", h("h2", null, "good luck")),
  ]),
  app
);
// render(h(Text, "vue3"), app);
setTimeout(() => {
  // render(h(Text, "vue3"), app);
  // render(
  //   h(Fragment, [h(Text, "vue3"), h("div", h("h1", null, "Hello vue3"))]),
  //   app
  // );
  render(null, app);
  // render(
  //   h("ul", [
  //     h("li", { key: "a", style: { background: "orange" } }, "a"),
  //     h("li", { key: "b" }, "b"),
  //     h("li", { key: "e" }, "e"),
  //     h("li", { key: "c" }, "c"),
  //     h("li", { key: "d" }, "d"),
  //     h("li", { key: "h" }, "h"),
  //     h("li", { key: "f" }, "f"),
  //     h("li", { key: "g" }, "g"),
  //   ]),
  //   app
  // );
}, 2000);
