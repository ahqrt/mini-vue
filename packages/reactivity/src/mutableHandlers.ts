import { isObject } from "@vue/shared";
import { activeEffect, track, trigger } from "./effect";
import { reactive } from "./reactive";

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
    let res = Reflect.get(target, key, receiver);
    if (isObject(res)) {
      return reactive(res)
    }
    return res
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