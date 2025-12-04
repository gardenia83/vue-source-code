# vue-source-code

这是一个简易的 vue 源码实现，主要给新手学习 vue 源码使用。

## vue3 响应式

目前实现的方法有：

1. reactive 函数
2. effect 函数
3. computed 函数
4. watch 函数
5. watchEffect 函数
6. ref 函数
7. toRefs 函数
8. toRef 函数
9. EffectScope 函数

## vue3 虚拟 DOM

简单实现了 h 函数和 render 函数

```js
render(
  h("div", null, "hello world", h("h1", { style: "color:red" }, "vue3")),
  app
);
```
