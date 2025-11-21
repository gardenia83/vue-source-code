let activeEffectScope = undefined;
export class EffectScope {
  effects = [];
  _active = true;
  parent = undefined;
  scopes = undefined;
  index = undefined;
  constructor(detached = false) {
    this.detached = detached;
    if (!detached && activeEffectScope) {
      this.index =
        (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1;
    }
  }

  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        this.parent = currentEffectScope;
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  stop(fromParent) {
    if (this._active) {
      this._active = false;
      for (let i = 0; i < this.effects.length; i++) {
        const effect = this.effects[i];
        effect.stop();
      }
      this.effects.length = 0;
      if (this.scopes) {
        for (let i = 0; i < this.scopes.length; i++) {
          this.scopes[i].stop(true);
        }
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !fromParent) {
        this.removeFromParent();
      }
      this.parent = undefined;
    }
  }
  removeFromParent() {
    if (this.parent.scopes) {
      const scopes = this.parent.scopes;
      const index = scopes.indexOf(this);
      if (index > -1) {
        scopes.splice(index, 1);
        for (let i = (index = 0); i < scopes.length; i++) {
          scopes[i].index = i;
        }
      }
    }
  }
}

export function effectScope(detached) {
  return new EffectScope(detached);
}

export function recordEffectScope(effect) {
  if (activeEffectScope && activeEffectScope._active) {
    activeEffectScope.effects.push(effect);
  }
}
