import { ShapeFlags } from "@vue/shared"

export function createRenderer(renderOptions) {

  let { insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
    setText: hostSetText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    createElement: hostCreateElement,
    createText: hostCreateText,
    patchProp: hostPatchProp,
  } = renderOptions

  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      patch(null, children[i], container)
    }
  }

  const mountElement = (vnode, container) => {
    const { type, props, children, shapeFlag } = vnode
    // 将真实元素挂在带这个虚拟节点上，后续用于复用节点
    let el = vnode.el = hostCreateElement(type)
    if (props) {
      for (let key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el)
    }


    // 将虚拟dom挂在真实dom上
    hostInsert(el, container)
  }


  // 核心的path逻辑
  const patch = (oldVNode, newVNode, container) => {
    if (oldVNode === newVNode) return

    if (oldVNode === null) {
      // 初次渲染
      // 后续还有组建的初次渲染，当前是元素的初始化渲染
      mountElement(newVNode, container)
    } else {

    }
  }

  const render = (vNode, container) => {
    console.log('vNode', vNode, 'container', container)

    // 如果当前vNode是空的话，说明没有需要渲染的内容, 走一个卸载逻辑
    if (vNode === null) {

    } else {
      // 这里既有初始化的逻辑，也有更新的逻辑
      patch(container._vnode || null, vNode, container)
      container._vnode = vNode
    }
  }

  return {
    render
  }
}