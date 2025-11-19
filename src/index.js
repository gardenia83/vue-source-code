// import "regenerator-runtime/runtime";
import { reactive, effect, computed, watch } from "./packages/index";
const state = reactive({
  firstName: "tom",
  lastName: "lee",
  friends: ["jacob", "james", "jimmy"],
});
const fullName = computed(() => {
  return state.firstName + " " + state.lastName;
});
effect(() => {
  app.innerHTML = `
    <div> Welcome ${fullName.value} !</div>
    <div> ${state.friends} </div>
  `;
});
watch([() => state.lastName, () => state.firstName], (oldValue, newValue) => {
  console.log("watch...");
});

setTimeout(() => {
  state.lastName = "jacob";
}, 1000);
setTimeout(() => {
  state.firstName = "james";
}, 1000);
