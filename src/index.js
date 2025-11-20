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
const fullName = computed({
  get() {
    return state.firstName + " " + state.lastName;
  },
  set(newValue) {
    [state.firstName, state.lastName] = newValue.split(" ");
  },
});
effect(() => {
  app.innerHTML = `
    <div> Welcome ${fullName.value} !</div>
    <div> ${state.friends} </div>
  `;
});

watch([() => state.lastName, () => state.firstName], (oldValue, newValue) => {
  console.log("oldValue: " + oldValue, "newValue: " + newValue);
});
// watchEffect(() => {
//   name.fullName = state.firstName + " " + state.lastName;
// });
// setTimeout(() => {
//   fullName.value = "jacob him";
// }, 1000);
// setTimeout(() => {
//   console.log("firstName: " + state.firstName, "lastName: " + state.lastName);
// }, 2000);

setTimeout(() => {
  state.lastName = "jacob";
}, 1000);
setTimeout(() => {
  state.firstName = "james";
}, 1000);
