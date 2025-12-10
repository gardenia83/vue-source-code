import { render } from "@/runtime-dom/index.js";
import { h } from "@/runtime-core";
const app = document.querySelector("#app");
const component = {
  data() {
    return {
      count: 0,
      age: "18",
    };
  },
  render() {
    return h(
      "div",
      {
        class: "app",
      },
      [
        h("p", {}, `count: ${this.count} age: ${this.age}`),
        h(
          "button",
          {
            onClick: () => {
              this.count++;
              this.age++;
            },
          },
          "click"
        ),
      ]
    );
  },
};
render(h(component), app);
