import { reactive } from "./reactive";
import { trigger } from "./effect";
import { isArray } from "./utils";

// 需要特殊处理的数组修改方法（Vue3 源码中也是用 Set 存储）
export const arrayInstrumentations = new Set([
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse",
]);

/**
 * 包装数组修改方法，添加响应式能力
 * @param {string} method - 数组方法名
 * @returns 包装后的函数
 */
function createArrayMethod(method) {
  // 获取原生数组方法
  const originalMethod = Array.prototype[method];

  return function (...args) {
    // 1. 执行原生数组方法（保证原有功能不变）
    const result = originalMethod.apply(this, args);

    // 2. 处理新增元素的响应式转换（push/unshift/splice 可能添加新元素）
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args; // 这两个方法的参数就是新增元素
        break;
      case "splice":
        inserted = args.slice(2); // splice 第三个参数及以后是新增元素
        break;
    }
    // 新增元素转为响应式（递归处理对象/数组）
    if (inserted) {
      inserted.forEach((item) => {
        if (typeof item === "object" && item !== null) {
          reactive(item);
        }
      });
    }

    // 3. 触发依赖更新（Vue3 源码中会触发 length 和对应索引的更新）
    trigger(this, "length");
    return result;
  };
}

// 生成所有包装后的数组方法（键：方法名，值：包装函数）
export const arrayMethods = Object.create(null);
arrayInstrumentations.forEach((method) => {
  arrayMethods[method] = createArrayMethod(method);
});

/**
 * 判断是否是需要拦截的数组方法
 * @param {unknown} target - 目标对象
 * @param {string} key - 属性名/方法名
 * @returns boolean
 */
export function isArrayInstrumentation(target, key) {
  return isArray(target) && arrayInstrumentations.has(key);
}
