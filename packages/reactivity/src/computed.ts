import { ReactiveEffect, track, trackEffects, triggerEffects } from './effect';
import { isFunction } from "@vue/shared";

class ComputedRefImpl {
  effect: ReactiveEffect = undefined
  // 默认应该取值的时候进行计算
  private _dirty = true
  private __v_isReadonly = true
  private __v_isRef = true
  private _value
  private dep

  constructor(public getter, public setter) {
    this.effect = new ReactiveEffect(getter, () => {
      // 稍后依赖的属性变化会执行此回掉函数
      if (!this._dirty) {
        this._dirty = true

        // 实现一个触发更新的机制
        triggerEffects(this.dep)
      }
    })
  }

  get value() {
    // 做依赖收集
    this.dep = new Set()
    trackEffects(this.dep || (this.dep = new Set()))

    if (this._dirty) {
      // 说明这个值是脏值，需要重新计算
      this._dirty = false
      this._value = this.effect.run()

    }
    return this._value
  }

  set value(newValue) {
    this.setter(newValue)
  }
}

export function computed(getterOrOptions) {
  let onlyGetter = isFunction(getterOrOptions)
  let getter
  let setter
  if (onlyGetter) {
    getter = getterOrOptions
    setter = () => { }
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  return new ComputedRefImpl(getter, setter)
}


