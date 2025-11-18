// import "regenerator-runtime/runtime";
import { reactive, effect } from "./packages/index";
const state = reactive({
  name: "vue3",
  version: "3.4.5",
  author: "vue team",
  issuesList: [
    {
      id: 2,
      title: "issue2",
    },
    {
      id: 1,
      title: "issue1",
    },
  ],
});
effect(() => {
  // console.log("effect");

  // const issuesString = state.issuesList
  //   .map((issues) => issues.title)
  //   .toString();
  // app.innerHTML = issuesString;
  app.innerHTML = state.name;
});
setTimeout(() => {
  state.name = "vue3.4.5";
  // state.issuesList.push({
  //   id: 3,
  //   title: "issue3",
  // });
  // state.issuesList.sort((a, b) => a.id - b.id);
  // console.log(state.issuesList);
}, 1000);
