import { isArray, isString, ShapeFlags } from "@vue/shared";

export const Text = Symbol("TEXT");

export function isVNode(value) {
  return !!(value && value.__v_isVNode)
}

/**
 * 判断两个虚拟节点是不是相同节点
 * 标签相同，key相同
 * @param n1 
 * @param n2 
 * @returns 
 */
export function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key
}

/**
 * 
 * @param type 
 * @param props 
 * @param children 
 */
export function createVNode(type, props, children = null) {
  // 组合方案 shapeFlag
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0
  /**
   * 虚拟dom
   * 为了跨平台和diff算法
   */
  const vNode = {
    __v_isVNode: true,
    shapeFlag,
    type,
    props,
    children,
    key: props?.['key'],
    // 虚拟节点上对应的真实节点， 后续diff算法使用
    el: null
  }

  if (children) {
    let type = 0
    if (isArray(children)) {
      type = ShapeFlags.ARRAY_CHILDREN
    } else {
      children = String(children)
      type = ShapeFlags.TEXT_CHILDREN
    }
    vNode.shapeFlag |= type
  }
  return vNode
}