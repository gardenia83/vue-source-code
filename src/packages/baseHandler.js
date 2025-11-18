// baseHandlers.js
import { isObject } from "./utils";
import { ReactiveFlags, reactive } from "./reactive";
import { track, trigger } from "./effect";
// 引入抽离的数组工具
import { isArrayInstrumentation, arrayMethods } from "./arrayInstrumentations";

export const mutableHandlers = {
  get(target, key, receiver) {
    // 1. 响应式标识判断（Vue3 源码标准逻辑）
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    // 2. 收集依赖（所有属性访问都需要追踪）
    track(target, key);
    // 3. 执行原生 get 操作
    const result = Reflect.get(target, key, receiver);
    // 4. 数组方法拦截：如果是需要处理的数组方法，返回包装后的函数
    if (isArrayInstrumentation(target, key)) {
      // 绑定 this 为目标数组，确保原生方法执行时上下文正确
      return arrayMethods[key].bind(target);
    }
    // 5. 深层响应式：嵌套对象/数组自动转为响应式（Vue3 懒代理特性）
    if (result && isObject(result)) {
      return reactive(result);
    }

    return result;
  },

  set(target, key, value, receiver) {
    const oldValue = target[key];
    const isArrayTarget = Array.isArray(target);
    // 6. 执行原生 set 操作
    const success = Reflect.set(target, key, value, receiver);
    // 7. 只有值变化且是自身属性时，才触发更新（避免原型链干扰）
    if (success && oldValue !== value) {
      // 数组索引设置：触发对应索引和 length 更新（Vue3 源码逻辑）
      if (isArrayTarget && key !== "length") {
        const index = Number(key);
        if (index >= 0 && index < target.length) {
          trigger(target, key); // 触发索引更新
          trigger(target, "length"); // 触发长度更新
          return success;
        }
      }
      // 普通对象/数组 length 设置：触发对应 key 更新
      trigger(target, key);
    }
    return success;
  },
};
