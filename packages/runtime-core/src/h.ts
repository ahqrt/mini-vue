import { isObject } from '@vue/shared';
import { isArray } from '@vue/shared';
import { createVNode, isVNode } from "./vnode"

export function h(type, props, children = null) {
  const l = arguments.length

  if (l === 2) {

    if (isObject(props) && !isArray(props)) {
      if (isVNode(props)) { // 虚拟节点
        return createVNode(type, null, [props])
      }
      // 属性
      return createVNode(type, props)
    } else {
      // 子节点数组或者文本
      return createVNode(type, null, children)
    }

  } else {
    if (l > 3) {
      children = Array.from(arguments).slice(2)
    } else if (l === 3 && isVNode(children)) {
      children = [children]
    }

    return createVNode(type, props, children)
  }
}