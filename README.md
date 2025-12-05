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

### 1. 简单实现了 h 函数和 render 函数

```js
const app = document.getElementById("app");
render(
  h("div", null, "hello world", h("h1", { style: "color:red" }, "vue3")),
  app
);
```

如果 render 第一个参数是 null, 则移除节点

```js
render(null, app);
```

### 2. 简单实现了 diff 算法

| 新节点 | 旧节点 | 操作方式                   |
| ------ | ------ | -------------------------- |
| 文本   | 数组   | 删除旧节点，设置文本内容   |
| 文本   | 文本   | 更新文本内容               |
| 文本   | 空节点 | 更新文本内容               |
| 数组   | 数组   | diff 算法(TODO)            |
| 数组   | 文本   | 清空文本，进行数组节点挂载 |
| 数组   | 空     | 进行数组节点挂载           |
| 空     | 数组   | 删除所有旧节点             |
| 空     | 文本   | 清空文本                   |
| 空     | 空     | 什么也不做                 |
