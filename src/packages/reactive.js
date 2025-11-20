import { mutableHandlers } from "./baseHandler.js";
import { isObject } from "./utils.js";
import { ReactiveFlags } from "./constants.js";

// 缓存代理对象，避免重复代理
const reactiveMap = new WeakMap();
export function reactive(target) {
  if (!isObject(target)) {
    return target;
  }
  // 避免重复代理
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }
  const existsProxy = reactiveMap.get(target);
  if (existsProxy) {
    return existsProxy;
  }
  const proxy = new Proxy(target, mutableHandlers);
  reactiveMap.set(target, proxy);
  return proxy;
}

export function isReactive(target) {
  return isObject(target) && target[ReactiveFlags.IS_REACTIVE];
}
