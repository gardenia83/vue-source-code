import { ReactiveFlags } from "./constants";
import { activeEffect, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";
import { isObject } from "./utils";

class RefImpl {
  _value;
  __rawValue;
  dep = new Set(); // vue3最新版本 使用Dep类
  [ReactiveFlags.IS_REF] = true;
  [ReactiveFlags.IS_SHALLOW] = false;
  constructor(value) {
    this.__rawValue = value;
    this._value = toReactive(value);
  }
  get value() {
    if (activeEffect) {
      trackEffects(this.dep);
    }
    return this._value;
  }
  set value(newValue) {
    if (newValue !== this.__rawValue) {
      this._value = toReactive(newValue);
      this.__rawValue = newValue;
      triggerEffects(this.dep);
    }
  }
}
export function ref(value, shallow) {
  return createRef(value, shallow);
}
function createRef(rawValue, shallow) {
  return new RefImpl(rawValue, shallow);
}
export function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}
