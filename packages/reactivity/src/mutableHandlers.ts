import { activeEffect, track, trigger } from "./effect";

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

export const mutableHandlers = {
  get: (target, key, receiver) => {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    // 进行依赖收集
    track(target, key)
    return Reflect.get(target, key, receiver);
  },
  set: (target, key, value, receiver) => {
    const oldValue = target[key];

    if (oldValue === value) {
      return true
    }
    const res = Reflect.set(target, key, value, receiver);
    // 触发依赖更新
    trigger(target, key, value, oldValue)

    return res
  }
}