import { isFunction } from "./utils";
import {
  activeEffect,
  ReactiveEffect,
  trackEffects,
  triggerEffects,
} from "./effect";
class ComputedRefImpl {
  effect = undefined;
  _value = undefined;
  __v_isRef = true; // 判断是否是通过value取值
  _dirty = true;
  dep = undefined;
  constructor(getter, setter) {
    this.getter = getter;
    this.setter = isFunction(setter) ? setter : () => {};
    this.effect = new ReactiveEffect(getter, () => {
      this._dirty = true;
      triggerEffects(this.dep);
    });
  }
  get value() {
    if (activeEffect) {
      trackEffects(this.dep || (this.dep = new Set()));
    }
    if (this._dirty) {
      this._value = this.effect.run();
      this._dirty = false;
    }
    return this._value;
  }
  set value(newValue) {
    if (this.setter) {
      this.setter(newValue);
    }
  }
}
export const computed = (getterOrOptions) => {
  let getter;
  let setter = undefined;
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter);
  return cRef;
};
