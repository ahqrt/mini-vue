function createInvoker(handler) {
  const invoker = (e) => invoker.value(e);
  invoker.value = handler;
  return invoker
}

export function patchEvent(el, eventName, next) {

  /**
   * 可以先移除事件，再重新绑定，但是这样比较浪费性能
   * 所以在vue里面是如下处理的
   */
  let invokers = el._vei || (el._vei = {})
  let exits = invokers[eventName]

  if (exits && next) {
    exits.value = next
  } else {
    let event = eventName.slice(2).toLowCase()
    if (next) {
      const invoker = invokers[eventName] = createInvoker(next)
      el.addEventListener(event, invoker)
    } else if (exits) { // 如果有老值，需要将之前的值移除掉
      el.removeEventListener(event, exits)
      invokers[eventName] = undefined
    }
  }

}