import { patchAttr } from "./modules/attr"
import { patchClass } from "./modules/class"
import { patchEvent } from "./modules/event"
import { patchStyle } from "./modules/style"

/**
 * 对于dom属性的更新
 * @param el 元素
 * @param key 属性
 * @param preValue 前一个值 
 * @param nextValue 后一个值
 */
export function patchProp(el, key, preValue, nextValue) {
  // 类名处理 el.className
  if (key === 'class') {
    patchClass(el, nextValue)
  }
  // 样式处理 el.style
  else if (key === 'style') {
    patchStyle(el, preValue, nextValue)
  }
  // 事件处理 addEventListener
  else if (/^on[^a-z]/.test(key)) {
    patchEvent(el, key, nextValue)
  }
  // 普通属性 el.setAttribute
  else {
    patchAttr(el, key, nextValue)
  }
}