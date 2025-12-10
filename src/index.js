import { render } from "@/runtime-dom";
import { h, Text, Fragment } from "@/runtime-core";
const app = document.querySelector("#app");
const Child = {
  props: {
    a: String,
  },
  render() {
    return h(Text, this.a);
  },
};
const Component = {
  data() {
    return {
      isShow: false,
    };
  },
  render() {
    return h(Fragment, [
      h(
        "button",
        {
          onClick: () => {
            return (this.isShow = !this.isShow);
          },
        },
        "修改状态"
      ),
      h(Child, { a: this.isShow ? "显示" : "隐藏" }),
    ]);
  },
};
render(h(Component), app);
