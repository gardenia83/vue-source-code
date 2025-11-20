import { isFunction } from "./utils";
import {
  activeEffect,
  ReactiveEffect,
  trackEffects,
  triggerEffects,
} from "./effect";

/**
 * 计算属性实现类
 * 负责管理计算属性的getter、setter以及缓存机制
 */
class ComputedRefImpl {
  effect = undefined; // 响应式副作用实例
  _value = undefined; // 缓存的计算结果
  __v_isRef = true; // 标识这是一个ref对象，可以通过.value访问
  _dirty = true; // 脏值标记，true表示需要重新计算
  dep = undefined; // 依赖收集容器，存储依赖当前计算属性的副作用

  /**
   * 构造函数
   * @param {Function} getter - 计算属性的getter函数
   * @param {Function} setter - 计算属性的setter函数
   */
  constructor(getter, setter) {
    this.getter = getter;
    this.setter = isFunction(setter) ? setter : () => {};

    // 创建响应式副作用实例，当依赖的数据变化时会触发调度器
    this.effect = new ReactiveEffect(getter, () => {
      // 调度器函数：当依赖变化时执行
      this._dirty = true; // 标记为脏值，下次访问时需要重新计算
      triggerEffects(this.dep); // 触发依赖当前计算属性的副作用更新
    });
  }

  /**
   * 计算属性的getter
   * 实现缓存机制和依赖收集
   */
  get value() {
    // 如果存在激活的副作用，则进行依赖收集
    if (activeEffect) {
      trackEffects(this.dep || (this.dep = new Set()));
    }

    // 如果是脏值，则重新计算并缓存结果
    if (this._dirty) {
      this._value = this.effect.run(); // 执行getter函数获取新值
      this._dirty = false; // 清除脏值标记
    }

    return this._value; // 返回缓存的值
  }

  /**
   * 计算属性的setter
   * @param {any} newValue - 新的值
   */
  set value(newValue) {
    // 如果有setter函数，则调用它
    if (this.setter) {
      this.setter(newValue);
    }
  }
}

/**
 * 创建计算属性的工厂函数
 * @param {Function|Object} getterOrOptions - getter函数或包含get/set的对象
 * @returns {ComputedRefImpl} 计算属性引用实例
 */
export const computed = (getterOrOptions) => {
  let getter; // getter函数
  let setter = undefined; // setter函数

  // 根据参数类型确定getter和setter
  if (isFunction(getterOrOptions)) {
    // 如果参数是函数，则作为getter
    getter = getterOrOptions;
  } else {
    // 如果参数是对象，则分别获取get和set方法
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }

  // 创建并返回计算属性实例
  const cRef = new ComputedRefImpl(getter, setter);
  return cRef;
};
