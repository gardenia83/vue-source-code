// 当前激活的副作用作用域
let activeEffectScope = undefined;

/**
 * 副作用作用域类
 * 用于管理一组相关的副作用(effect)，支持统一控制这些副作用的激活与停止
 */
export class EffectScope {
  // 存储该作用域下的所有副作用
  effects = [];
  // 标记作用域是否处于激活状态
  _active = true;
  // 父级作用域引用
  parent = undefined;
  // 存储子作用域数组
  scopes = undefined;
  // 在父作用域中的索引位置
  index = undefined;

  /**
   * 构造函数
   * @param {boolean} detached - 是否为独立作用域（不被父作用域自动管理）
   */
  constructor(detached = false) {
    this.detached = detached;
    // 如果不是独立作用域且存在当前激活的作用域，则将当前实例加入到父作用域中
    if (!detached && activeEffectScope) {
      this.index =
        (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1;
    }
  }

  /**
   * 在当前作用域内运行指定函数
   * @param {Function} fn - 要执行的函数
   * @returns {*} 函数执行结果
   */
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        // 设置当前作用域为本实例，并执行函数
        this.parent = currentEffectScope;
        activeEffectScope = this;
        return fn();
      } finally {
        // 执行完毕后恢复原来的作用域
        activeEffectScope = currentEffectScope;
      }
    }
  }

  /**
   * 停止作用域及其管理的所有副作用
   * @param {boolean} fromParent - 是否由父作用域调用触发
   */
  stop(fromParent) {
    if (this._active) {
      this._active = false;
      // 停止所有关联的副作用
      for (let i = 0; i < this.effects.length; i++) {
        const effect = this.effects[i];
        effect.stop();
      }
      this.effects.length = 0;

      // 递归停止所有子作用域
      if (this.scopes) {
        for (let i = 0; i < this.scopes.length; i++) {
          this.scopes[i].stop(true);
        }
        this.scopes.length = 0;
      }

      // 如果不是独立作用域且有父作用域，从父作用域中移除自己
      if (!this.detached && this.parent && !fromParent) {
        this.removeFromParent();
      }
      this.parent = undefined;
    }
  }

  /**
   * 从父作用域中移除自身
   */
  removeFromParent() {
    if (this.parent.scopes) {
      const scopes = this.parent.scopes;
      const index = scopes.indexOf(this);
      if (index > -1) {
        scopes.splice(index, 1);
        // 更新后续元素的索引
        for (let i = 0; i < scopes.length; i++) {
          scopes[i].index = i;
        }
      }
    }
  }
}

/**
 * 创建一个新的副作用作用域
 * @param {boolean} detached - 是否为独立作用域
 * @returns {EffectScope} 新创建的作用域实例
 */
export function effectScope(detached) {
  return new EffectScope(detached);
}

/**
 * 将副作用记录到当前激活的作用域中
 * @param {Object} effect - 要记录的副作用对象
 */
export function recordEffectScope(effect) {
  if (activeEffectScope && activeEffectScope._active) {
    activeEffectScope.effects.push(effect);
  }
}
