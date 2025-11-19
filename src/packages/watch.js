import { isReactive } from "./reactive";
import { ReactiveEffect } from "./effect";
import { isFunction } from "./utils";
/**
 * 监听响应式数据变化并执行回调函数
 * @param {Object|Function} source - 要监听的数据源，可以是响应式对象或函数
 * @param {Function} cb - 数据变化时执行的回调函数
 * @param {Object} options - 配置选项
 * @param {boolean} options.immediate - 是否立即执行回调函数，默认为true
 */
export function watch(source, cb, { immediate = true } = {}) {
  let getter;
  if (isReactive(source)) {
    // 如果是响应式对象 则调用traverse
    getter = () => traverse(source);
  } else if (isFunction(source)) {
    // 如果是函数 则直接执行
    getter = source;
  }
  let oldValue;
  // 定义副作用执行的任务函数
  const job = () => {
    let newValue = effect.run(); // 获取最新值
    cb(oldValue, newValue); // 触发回调
    oldValue = newValue; // 新值赋给旧值
  };

  // 创建响应式副作用实例
  const effect = new ReactiveEffect(getter, job);
  if (immediate) {
    job();
  } else {
    oldValue = effect.run();
  }
}
/**
 * 遍历对象及其嵌套属性的函数
 * @param {any} source - 需要遍历的源数据
 * @param {Set} s - 用于记录已访问对象的集合，避免循环引用
 * @returns {any} 返回原始输入数据
 */
export function traverse(source, s = new Set()) {
  // 检查是否为对象类型，如果不是则直接返回
  if (!isObject(source)) {
    return source;
  }

  // 检测循环引用，如果对象已被访问过则直接返回
  if (s.has(source)) {
    return source;
  }

  // 将当前对象加入已访问集合
  s.add(source);

  // 递归遍历对象的所有属性
  for (const key in source) {
    traverse(source[key], s);
  }

  return source;
}
