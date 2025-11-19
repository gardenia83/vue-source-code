// 当前响应器
export let activeEffect;

// 清理依赖
export function cleanupEffect(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}
export class ReactiveEffect {
  active = true;
  deps = [];
  parent = undefined;
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      // 清除旧依赖
      cleanupEffect(this);

      return this.fn();
    } finally {
      activeEffect = this.parent;
      this.parent = undefined;
    }
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      this.active = false;
    }
  }
}
export function effect(fn, options = {}) {
  const e = new ReactiveEffect(fn, options.scheduler);
  e.run();
  // 给到用户自行控制响应
  const runner = e.run.bind(e);
  runner.effect = e;
  return runner;
}
export const targetMap = new WeakMap();
// 收集依赖
/*
最终的数据格式：
  weakMap {
    target: map:{
      key: set(effect)
    }
  }
*/
export function track(target, key) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set())); // Vue3内部是一个Dep类
  }
  trackEffects(dep);
}

export function trackEffects(dep) {
  let shouldTrack = !dep.has(activeEffect);
  if (shouldTrack) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
// 触发依赖
export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  let dep = depsMap.get(key);
  if (dep) triggerEffects(dep);
}
export function triggerEffects(dep) {
  const effects = [...dep];
  effects.forEach((effect) => {
    if (effect != activeEffect) {
      if (!effect.scheduler) {
        effect.run();
      } else {
        effect.scheduler();
      }
    }
  });
}
