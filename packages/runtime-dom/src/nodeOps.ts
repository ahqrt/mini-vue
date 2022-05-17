export const nodeOps = {
  /**
   * 
   * @param child 插入的元素
   * @param parent 插入到谁里面
   * @param anchor 参考的位置，插入到谁前面去
   */
  insert(child, parent, anchor = null) {
    if (anchor) {
      parent.insertBefore(child, anchor)
    } else {
      parent.appendChild(child)
    }
  },

  /**
   * 删除节点
   * @param child 
   */
  remove(child) {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child)
    }
  },

  /**
   * 将节点内容设置为文本
   * @param el 
   * @param text 
   */
  setElementText(el, text) {
    el.textContent = text
  },

  /**
   * 设置文本节点内容
   * @param node 
   * @param text 
   */
  setText(node, text) {
    node.nodeValue = text
  },

  /**
   * 查询
   * @param selector 
   * @returns 
   */
  querySelector(selector) {
    return document.querySelector(selector)
  },

  /**
   * 获取父亲节点
   * @param selector 
   * @returns 
   */
  parentNode(selector) {
    return selector.parentNode
  },

  nextSibling(selector) {
    return selector.nextSibling
  },

  createElement(tag) {
    return document.createElement(tag)
  },

  createText(text) {
    return document.createTextNode(text)
  },

}