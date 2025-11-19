// import "regenerator-runtime/runtime";
import {
  reactive,
  effect,
  computed,
  watchEffect,
  watch,
} from "./packages/index";
const state = reactive({
  firstName: "tom",
  lastName: "lee",
  friends: ["jacob", "james", "jimmy"],
});
const name = reactive({
  fullName: "---",
});
const fullName = computed(() => {
  return state.firstName + " " + state.lastName;
});
effect(() => {
  app.innerHTML = `
    <div> Welcome ${name.fullName} !</div>
    <div> ${state.friends} </div>
  `;
});
// watch([() => state.lastName, () => state.firstName], (oldValue, newValue) => {
//   console.log("watch...");
// });
watchEffect(() => {
  console.log(111);

  name.fullName = state.firstName + " " + state.lastName;
});

setTimeout(() => {
  state.lastName = "jacob";
}, 1000);
setTimeout(() => {
  state.firstName = "james";
}, 1000);
