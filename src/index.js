// import "regenerator-runtime/runtime";
import { reactive, effect } from "./packages/index";
const state = reactive({
  name: "vue",
  version: "3.4.5",
  author: "vue team",
  friends: ["jake", "james"],
});
const runner = effect(
  () => {
    app.innerHTML = `
    <div> Welcome ${state.name} !</div>
    <div> ${state.friends} </div>
  `;
  },
  {
    scheduler() {
      setTimeout(() => {
        runner();
      }, 1000);
    },
  }
);

setTimeout(() => {
  state.name = "vue3";
  state.friends[2] = "jacob";
}, 1000);
