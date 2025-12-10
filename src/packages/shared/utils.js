/**
 * 检查值是否为对象类型（不包括null）
 * @param {*} value - 要检查的值
 * @returns {boolean} 如果是对象且不为null则返回true，否则返回false
 */
export function isObject(value) {
  return typeof value === "object" && value !== null;
}

export function isSymbol(value) {
  return typeof value === "symbol";
}

/**
 * 检查目标值是否为数组
 * @param {*} target - 要检查的目标值
 * @returns {boolean} 如果是数组则返回true，否则返回false
 */
export function isArray(target) {
  return Array.isArray(target);
}

/**
 * 检查值是否为函数类型
 * @param {*} value - 要检查的值
 * @returns {boolean} 如果是函数则返回true，否则返回false
 */
export function isFunction(value) {
  return typeof value === "function";
}

/**
 * 检查值是否为字符串类型
 * @param {*} value - 要检查的值
 * @returns {boolean} 如果是字符串则返回true，否则返回false
 */
export function isString(value) {
  return typeof value === "string";
}

export const extend = Object.assign;

/**
 * 检查给定的字符串是否以"on"开头，且第三个字符不是小写字母
 * 通常用于检测事件监听器属性名，如onClick, onChange等
 * @param {string} key - 要检查的字符串
 * @returns {boolean} 如果字符串以"on"开头且第三个字符不是小写字母则返回true，否则返回false
 */
export const isOn = (key) => {
  // 通过ASCII码检查前两个字符是否为'o'(111)和'n'(110)
  // 并确保第三个字符不在小写字母范围(97-122)内
  return (
    key.charCodeAt(0) === 111 &&
    key.charCodeAt(1) === 110 &&
    (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97)
  );
};

/**
 * 检查给定的字符串是否以"onUpdate:"开头
 * 通常用于检测v-model的更新事件监听器
 * @param {string} key - 要检查的字符串
 * @returns {boolean} 如果字符串以"onUpdate:"开头则返回true，否则返回false
 */
export const isModelListener = (key) => {
  return key.startsWith("onUpdate:");
};

const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (value, key) => hasOwnProperty.call(value, key);

/**
 * 创建一个带缓存功能的字符串处理函数
 * 避免对相同字符串重复执行转换操作
 * @param {Function} fn - 字符串处理函数
 * @returns {Function} 返回带缓存功能的新函数
 */
const cacheStringFunction = (fn) => {
  const cache = Object.create(null); // 创建无原型的对象作为缓存容器
  return (str) => {
    const hit = cache[str]; // 查找缓存中是否存在该字符串
    return hit || (cache[str] = fn(str)); // 如果缓存命中则返回缓存值，否则执行函数并缓存结果
  };
};

// 匹配大写字母（不在单词边界处）的正则表达式
// 用于驼峰命名转连字符命名
const hyphenateRE = /\B([A-Z])/g;

/**
 * 将驼峰命名转换为连字符命名格式
 * 例如：camelCase -> camel-case
 * 使用缓存机制避免重复转换相同字符串
 */
export const hyphenate = cacheStringFunction((str) =>
  // 将大写字母替换为"-"+小写字母的形式
  str.replace(hyphenateRE, "-$1").toLowerCase()
);

export function includeBooleanAttr(value) {
  return !!value || value === "";
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
export function isSpecialBooleanAttr(key) {
  return makeMap(specialBooleanAttrs);
}

export function makeMap(str) {
  const map = Object.create(null);
  for (const key of str.split(",")) map[key] = 1;
  return (val) => val in map;
}
const camelizeRE = /-\w/g;

export const camelize = (str) => {
  return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
};
