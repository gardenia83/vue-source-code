import { hyphenate } from "@/shared/utils";
// 定义一个唯一的Symbol作为key，用于在元素上存储事件处理器映射
const veiKey = Symbol("_vei");

/**
 * 添加事件监听器的封装函数
 * @param {Element} el - 目标元素
 * @param {string} event - 事件名称
 * @param {Function} handler - 事件处理器
 * @param {Object} options - 事件监听选项
 */
export function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}

/**
 * 移除事件监听器的函数（待实现）
 */
export function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}

/**
 * 更新元素事件处理器的核心函数
 * @param {Element} el - 目标元素
 * @param {string} rawName - 原始事件名称（可能包含修饰符）
 * @param {*} preValue - 旧的事件处理器
 * @param {*} nextValue - 新的事件处理器
 * @param {*} instance - 组件实例
 */
export function patchEvent(el, rawName, preValue, nextValue, instance) {
  // 获取或初始化元素上的事件处理器映射表
  const invokers = el[veiKey] || (el[veiKey] = {});
  // 获取已存在的事件处理器
  const existingInvoker = invokers[rawName];

  // 如果新值存在且已有事件处理器，则直接更新值（优化性能）
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    // 解析事件名称和选项
    const [name, options] = parseName(rawName);
    if (nextValue) {
      // 创建新的事件处理器并添加到元素上
      const invoker = (invokers[rawName] = createInvoker(nextValue, instance));
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      // 移除事件监听器并清理映射表
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = undefined;
    }
  }
}

/**
 * 创建事件处理器包装函数
 * @param {*} initialValue - 初始事件处理器
 * @param {*} instance - 组件实例
 * @returns {Function} 包装后的事件处理器
 */
function createInvoker(initialValue, instance) {
  // 创建一个包装函数，实际执行时调用value属性
  const invoker = (e) => invoker.value(e);
  // 将初始值赋给value属性，便于后续更新
  invoker.value = initialValue;
  return invoker;
}

const optionsModifierRE = /(?:Once|Passive|Capture)$/;
/**
 * 解析事件名称，提取事件名和选项
 * @param {string} name - 原始事件名称
 * @returns {[string, Object]} 解析后的事件名和选项对象
 */
function parseName(name) {
  let options;
  // 检查是否存在选项修饰符
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    // 提取所有选项修饰符
    while ((m = name.match(optionsModifierRE))) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  // 处理事件名称，支持v-on:和@两种语法
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
