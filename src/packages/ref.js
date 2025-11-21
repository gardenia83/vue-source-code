// 导入常量和依赖
import { ReactiveFlags } from "./constants";
import { activeEffect, trackEffects, triggerEffects } from "./effect";
import { toReactive } from "./reactive";
import { isObject, isFunction, isArray } from "./utils";

/**
 * Ref 实现类
 * 用于创建基本的响应式引用
 */
class RefImpl {
  _value; // 存储响应式值
  __rawValue; // 存储原始值（用于比较）
  dep = new Set(); // 依赖收集集合
  [ReactiveFlags.IS_REF] = true; // 标识为 ref 对象
  [ReactiveFlags.IS_SHALLOW] = false; // 是否为浅层 ref

  /**
   * 构造函数
   * @param {any} value - 初始值
   */
  constructor(value) {
    this.__rawValue = value;
    this._value = toReactive(value); // 如果是对象则转换为响应式
  }

  /**
   * 获取 ref 的值
   * @returns {any} 当前值
   */
  get value() {
    // 如果存在激活的副作用，则收集依赖
    if (activeEffect) {
      trackEffects(this.dep);
    }
    return this._value;
  }

  /**
   * 设置 ref 的值
   * @param {any} newValue - 新值
   */
  set value(newValue) {
    // 只有当新值不等于旧值时才更新
    if (newValue !== this.__rawValue) {
      this._value = toReactive(newValue);
      this.__rawValue = newValue;
      triggerEffects(this.dep); // 触发依赖更新
    }
  }
}

/**
 * 对象属性引用实现类
 * 用于将对象的某个属性转换为 ref
 */
class ObjectRefImpl {
  [ReactiveFlags.IS_REF] = true; // 标识为 ref 对象
  _object; // 源对象
  _key; // 属性键
  _defaultValue; // 默认值

  /**
   * 构造函数
   * @param {object} object - 源对象
   * @param {string|number} key - 属性键
   * @param {any} defaultValue - 默认值
   */
  constructor(object, key, defaultValue) {
    this._object = object;
    this._key = key;
    this._defaultValue = defaultValue;
  }

  /**
   * 获取属性值
   * @returns {any} 属性值或默认值
   */
  get value() {
    const val = this._object[this._key];
    return (this._value = val === undefined ? this._defaultValue : val);
  }

  /**
   * 设置属性值
   * @param {any} newValue - 新值
   */
  set value(newValue) {
    this._object[this._key] = newValue;
  }
}

/**
 * getter 引用实现类
 * 用于将 getter 函数转换为响应式 ref
 */
class GetterRefImpl {
  [ReactiveFlags.IS_REF] = true; // 标识为 ref 对象
  _value = undefined; // 缓存值
  _getter; // getter 函数

  /**
   * 构造函数
   * @param {Function} getter - getter 函数
   */
  constructor(getter) {
    this._getter = getter;
  }

  /**
   * 执行 getter 并返回结果
   * @returns {any} getter 执行结果
   */
  get value() {
    return (this._value = this._getter());
  }
}

/**
 * 创建响应式引用
 * @param {any} value - 值
 * @param {boolean} shallow - 是否为浅层引用
 * @returns {RefImpl} ref 实例
 */
export function ref(value, shallow) {
  return createRef(value, shallow);
}

/**
 * 创建 ref 的内部函数
 * @param {any} rawValue - 原始值
 * @param {boolean} shallow - 是否为浅层引用
 * @returns {RefImpl} ref 实例
 */
function createRef(rawValue, shallow) {
  // 如果传入的值已经是 ref，则直接返回该 ref，避免重复包装
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}

/**
 * 将响应式对象的所有属性转换为 refs
 * @param {object|Array} object - 响应式对象
 * @returns {object} 包含所有属性 refs 的对象
 */
export function toRefs(object) {
  // 根据源对象类型初始化返回对象
  const ret = isArray(object) ? new Array(object.length) : {};

  // 遍历对象的所有可枚举属性（包括继承的属性）
  for (const key in object) {
    ret[key] = propertyToRef(object, key);
  }
  return ret;
}

/**
 * 将值或对象属性转换为 ref
 * @param {any} source - 源值或对象
 * @param {string|number} key - 属性键（可选）
 * @param {any} defaultValue - 默认值（可选）
 * @returns {RefImpl|ObjectRefImpl|GetterRefImpl} ref 实例
 */
export function toRef(source, key, defaultValue) {
  // 如果源已经是 ref，直接返回
  if (isRef(source)) {
    return source;
  }
  // 如果源是函数，创建 getter ref
  else if (isFunction(source)) {
    return new GetterRefImpl(source);
  }
  // 如果源是对象且提供了键，创建对象属性 ref
  else if (isObject(source) && arguments.length > 1) {
    return propertyToRef(source, key, defaultValue);
  }
  // 否则创建普通 ref
  else {
    return ref(source);
  }
}

/**
 * 将对象属性转换为 ref 的内部函数
 * @param {object} source - 源对象
 * @param {string|number} key - 属性键
 * @param {any} defaultValue - 默认值
 * @returns {ObjectRefImpl} 对象属性 ref
 */
function propertyToRef(source, key, defaultValue) {
  const val = source[key];
  // 如果属性值已经是 ref，直接返回；否则创建对象属性 ref
  return isRef(val) ? val : new ObjectRefImpl(source, key, defaultValue);
}

/**
 * 检查值是否为 ref
 * @param {any} r - 待检查值
 * @returns {boolean} 是否为 ref
 */
export function isRef(r) {
  return r ? r[ReactiveFlags.IS_REF] === true : false;
}
/**
 * 解包 ref 对象，如果是 ref 则返回其值，否则返回原始值
 * @param {any} ref - 可能是 ref 对象的值
 * @returns {any} ref 的值或原始值
 */
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

/**
 * 浅层解包处理器
 * 用于创建代理对象，自动解包属性中的 ref
 */
const shallowUnwrapHandlers = {
  /**
   * 拦截属性读取操作
   * @param {object} target - 目标对象
   * @param {string|symbol} key - 属性名
   * @param {object} receiver - 代理对象
   * @returns {any} 属性值（如果是 ref 则返回其 .value）
   */
  get(target, key, receiver) {
    // 获取原始属性值并自动解包 ref
    return unRef(Reflect.get(target, key, receiver));
  },

  /**
   * 拦截属性设置操作
   * @param {object} target - 目标对象
   * @param {string|symbol} key - 属性名
   * @param {any} value - 新值
   * @param {object} receiver - 代理对象
   * @returns {boolean} 设置是否成功
   */
  set(target, key, value, receiver) {
    const oldValue = target[key];

    // 如果旧值是 ref 且新值不是 ref，则直接更新旧 ref 的值
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    }
    // 否则执行正常的属性设置
    else {
      return Reflect.set(target, key, value, receiver);
    }
  },
};

/**
 * 创建一个代理对象，自动解包其中的 ref 属性
 * 在模板中使用时，会自动展开 ref 而无需使用 .value
 * @param {object} objectWithRefs - 包含 refs 的对象
 * @returns {Proxy} 代理对象
 */
export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
