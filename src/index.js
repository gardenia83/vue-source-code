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
watch(
  () => state.lastName,
  (oldValue, newValue) => {
    console.log(newValue, "newValue");

    if (newValue === "jacob") {
      console.log("watch: jacob");
      state.firstName = "jake";
    }
  }
);

setTimeout(() => {
  state.lastName = "jacob";
}, 1000);
