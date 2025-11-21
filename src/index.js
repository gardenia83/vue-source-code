// import "regenerator-runtime/runtime";
import {
  reactive,
  effect,
  computed,
  watchEffect,
  watch,
  ref,
  toRef,
  toRefs,
  proxyRefs,
  effectScope,
} from "./packages/reactivity/index.js";
const state = reactive({
  firstName: "tom",
  lastName: "lee",
  friends: ["jacob", "james", "jimmy"],
});
const scope = effectScope();
scope.run(() => {
  const fullName = computed(() => {
    return state.firstName + " " + state.lastName;
  });
  const app = document.getElementById("app");
  watch(
    () => state.firstName,
    () => {
      console.log("watch fullName");
    }
  );
  effect(() => {
    app.innerHTML = `<h1>${fullName.value}</h1>`;
  });
  setTimeout(() => {
    state.firstName = "tom1";
  }, 1000);
});
scope.stop();
