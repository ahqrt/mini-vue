import { isObject } from "@vue/shared";
import { mutableHandlers, ReactiveFlags } from "./mutableHandlers";


const reactiveMap = new WeakMap()

/**
 * reactive只能做对象的代理
 * 
 * @param target
 */
export function reactive(target) {
  if (!isObject(target)) {
    return
  }

  // 如果目标是一个代理对象，则这一步会走到get
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  // 如果target已经是reactive，则直接返回
  let existedProxy = reactiveMap.get(target)
  if (existedProxy) {
    return existedProxy
  }

  // 传入普通对象，就会通过new proxy代理一次
  // 如果传入的是proxy代理对象，则应该返回这个对象，
  const proxy = new Proxy(target, mutableHandlers);
  // 将proxy对象和原对象做一个映射，目的是为了
  // 在对一个原对象设置多个proxy对象的时候，节省内存空间
  //比如：
  /**
   * const data = {name: 1}
   * const proxy1 = reactive(data)
   * const proxy2 = reactive(data)
   */
  reactiveMap.set(target, proxy);
  return proxy;
}