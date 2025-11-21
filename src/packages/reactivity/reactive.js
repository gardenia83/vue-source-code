// 导入必要的依赖
import { mutableHandlers } from "./baseHandler.js"; // 响应式处理逻辑
import { isObject } from "../shared/utils.js"; // 工具函数：判断是否为对象
import { ReactiveFlags } from "./constants.js"; // 响应式标识常量

// 缓存已创建的响应式代理对象，避免对同一对象重复创建代理
// 使用 WeakMap 确保不会阻止垃圾回收
const reactiveMap = new WeakMap();

/**
 * 创建响应式对象
 * @param {object} target - 需要转换为响应式的对象
 * @returns {Proxy|any} 响应式代理对象或原始值
 */
export function reactive(target) {
  // 如果不是对象，直接返回原始值（基础类型不需要响应式处理）
  if (!isObject(target)) {
    return target;
  }

  // 如果对象已经是响应式对象，避免重复代理
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }

  // 检查是否已经为该对象创建过响应式代理，如果有则直接返回
  const existsProxy = reactiveMap.get(target);
  if (existsProxy) {
    return existsProxy;
  }

  // 创建新的响应式代理对象
  const proxy = new Proxy(target, mutableHandlers);

  // 将创建的代理对象缓存起来，避免重复创建
  reactiveMap.set(target, proxy);

  // 返回响应式代理对象
  return proxy;
}

/**
 * 检查对象是否为响应式对象
 * @param {any} target - 待检查的对象
 * @returns {boolean} 是否为响应式对象
 */
export function isReactive(target) {
  // 只有对象才可能是响应式对象，同时检查 IS_REACTIVE 标志
  return isObject(target) && target[ReactiveFlags.IS_REACTIVE];
}

/**
 * 将值转换为响应式对象（如果是对象的话）
 * @param {any} value - 需要转换的值
 * @returns {Proxy|any} 响应式对象或原始值
 */
export function toReactive(value) {
  // 如果是对象则创建响应式代理，否则返回原始值
  return isObject(value) ? reactive(value) : value;
}
