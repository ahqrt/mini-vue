import { isFunction } from '@vue/shared';
import { isObject } from '@vue/shared';
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";

function traversal(value, set = new Set()) {
  // 递归要有终结条件
  if (!isObject) {
    return value
  }

  if (set.has(value)) {
    return value
  }

  set.add(value)
  for (let key in value) {
    traversal(value[key], set)
  }
  return value
}

/**
 * 
 * @param source 用户传入的对象
 * @param cb 对应的用户的回调函数
 */
export function watch(source, cb) {
  let getter
  if (!isReactive) {
    return
  }
  // 对用户传入的数据，要进行循环（递归循环，只有循环访问对象上的每一个属性才会收集effect）

  if (isFunction(source)) {
    getter = source
  } else {
    getter = () => traversal(source)
  }
  let cleanup
  const onCleanup = (fn) => {
    // 保存用户传入的函数
    cleanup = fn
  }

  let oldValue
  const job = () => {
    // 下一个watch触发， 触发上一次的cleanup方法
    if (cleanup) {
      cleanup()
    }
    const newValue = effect.run()
    cb(newValue, oldValue, onCleanup)
  }

  // 监控自己构造的函数，如果自己构造的函数被调用，则会触发job函数
  const effect = new ReactiveEffect(getter, job)
  oldValue = effect.run()
}