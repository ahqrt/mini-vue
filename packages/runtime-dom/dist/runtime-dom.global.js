var VueRuntimeDOM = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/runtime-dom/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    Text: () => Text,
    createRenderer: () => createRenderer,
    createVNode: () => createVNode,
    h: () => h,
    isSameVNodeType: () => isSameVNodeType,
    isVNode: () => isVNode,
    render: () => render
  });

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return value !== null && typeof value === "object";
  };
  var isString = (value) => {
    return typeof value === "string";
  };
  var isArray = Array.isArray;

  // packages/runtime-core/src/vnode.ts
  var Text = Symbol("TEXT");
  function isVNode(value) {
    return !!(value && value.__v_isVNode);
  }
  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  function createVNode(type, props, children = null) {
    const shapeFlag = isString(type) ? 1 /* ELEMENT */ : 0;
    const vNode = {
      __v_isVNode: true,
      shapeFlag,
      type,
      props,
      children,
      key: props == null ? void 0 : props["key"],
      el: null
    };
    if (children) {
      let type2 = 0;
      if (isArray(children)) {
        type2 = 16 /* ARRAY_CHILDREN */;
      } else {
        children = String(children);
        type2 = 8 /* TEXT_CHILDREN */;
      }
      vNode.shapeFlag |= type2;
    }
    return vNode;
  }

  // packages/runtime-core/src/renderer.ts
  function createRenderer(renderOptions2) {
    let {
      insert: hostInsert,
      remove: hostRemove,
      setElementText: hostSetElementText,
      setText: hostSetText,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      createElement: hostCreateElement,
      createText: hostCreateText,
      patchProp: hostPatchProp
    } = renderOptions2;
    const normalize = (vNode) => {
      if (isString(vNode)) {
        return createVNode(Text, null, vNode);
      }
      return vNode;
    };
    const mountChildren = (children, container) => {
      for (let i = 0; i < children.length; i++) {
        let child = normalize(children[i]);
        patch(null, child, container);
      }
    };
    const mountElement = (vnode, container) => {
      const { type, props, children, shapeFlag } = vnode;
      let el = vnode.el = hostCreateElement(type);
      if (props) {
        for (let key in props) {
          hostPatchProp(el, key, null, props[key]);
        }
      }
      if (shapeFlag & 8 /* TEXT_CHILDREN */) {
        hostSetElementText(el, children);
      } else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
        mountChildren(children, el);
      }
      hostInsert(el, container);
    };
    const processText = (n1, n2, container) => {
      if (n1 === null) {
        hostInsert(n2.el = hostCreateText(n2.children), container);
      } else {
        const el = n2.el = n1.el;
        if (n1.children !== n2.children) {
          hostSetText(el, n2.children);
        }
      }
    };
    const processElement = (n1, n2, container) => {
      if (n1 === null) {
        mountElement(n2, container);
      } else {
      }
    };
    const patch = (oldVNode, newVNode, container) => {
      if (oldVNode === newVNode)
        return;
      if (oldVNode && !isSameVNodeType(oldVNode, newVNode)) {
        unmount(oldVNode);
        oldVNode = null;
      }
      const { type, shapeFlag } = newVNode;
      switch (type) {
        case Text:
          processText(oldVNode, newVNode, container);
          break;
        default:
          if (shapeFlag & 1 /* ELEMENT */) {
            processElement(oldVNode, newVNode, container);
          }
      }
    };
    const unmount = (vnode) => {
      hostRemove(vnode.el);
    };
    const render2 = (vNode, container) => {
      console.log("vNode", vNode, "container", container);
      if (vNode === null) {
        if (container._vnode) {
          unmount(container._vnode);
        }
      } else {
        patch(container._vnode || null, vNode, container);
      }
      container._vnode = vNode;
    };
    return {
      render: render2
    };
  }

  // packages/runtime-core/src/h.ts
  function h(type, props, children = null) {
    const l = arguments.length;
    if (l === 2) {
      if (isObject(props) && !isArray(props)) {
        if (isVNode(props)) {
          return createVNode(type, null, [props]);
        }
        return createVNode(type, props);
      } else {
        return createVNode(type, null, props);
      }
    } else {
      if (l > 3) {
        children = Array.from(arguments).slice(2);
      } else if (l === 3 && isVNode(children)) {
        children = [children];
      }
      return createVNode(type, props, children);
    }
  }

  // packages/runtime-dom/src/nodeOps.ts
  var nodeOps = {
    insert(child, parent, anchor = null) {
      if (anchor) {
        parent.insertBefore(child, anchor);
      } else {
        parent.appendChild(child);
      }
    },
    remove(child) {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    setElementText(el, text) {
      el.textContent = text;
    },
    setText(node, text) {
      node.nodeValue = text;
    },
    querySelector(selector) {
      return document.querySelector(selector);
    },
    parentNode(selector) {
      return selector.parentNode;
    },
    nextSibling(selector) {
      return selector.nextSibling;
    },
    createElement(tag) {
      return document.createElement(tag);
    },
    createText(text) {
      return document.createTextNode(text);
    }
  };

  // packages/runtime-dom/src/modules/attr.ts
  function patchAttr(el, key, nextValue) {
    if (nextValue) {
      el.setAttribute(key, nextValue);
    } else {
      el.removeAttribute(key);
    }
  }

  // packages/runtime-dom/src/modules/class.ts
  function patchClass(el, next) {
    if (next === null) {
      el.removeAttribute("class");
    } else {
      el.className = next;
    }
  }

  // packages/runtime-dom/src/modules/event.ts
  function createInvoker(handler) {
    const invoker = (e) => invoker.value(e);
    invoker.value = handler;
    return invoker;
  }
  function patchEvent(el, eventName, next) {
    let invokers = el._vei || (el._vei = {});
    let exits = invokers[eventName];
    if (exits && next) {
      exits.value = next;
    } else {
      let event = eventName.slice(2).toLowCase();
      if (next) {
        const invoker = invokers[eventName] = createInvoker(next);
        el.addEventListener(event, invoker);
      } else if (exits) {
        el.removeEventListener(event, exits);
        invokers[eventName] = void 0;
      }
    }
  }

  // packages/runtime-dom/src/modules/style.ts
  function patchStyle(el, pre, next) {
    if (pre === next) {
      return;
    }
    for (const key in pre) {
      if (!(key in next)) {
        el.style[key] = "";
      }
    }
    for (const key in next) {
      el.style[key] = next[key];
    }
  }

  // packages/runtime-dom/src/patchProp.ts
  function patchProp(el, key, preValue, nextValue) {
    if (key === "class") {
      patchClass(el, nextValue);
    } else if (key === "style") {
      patchStyle(el, preValue, nextValue);
    } else if (/^on[^a-z]/.test(key)) {
      patchEvent(el, key, nextValue);
    } else {
      patchAttr(el, key, nextValue);
    }
  }

  // packages/runtime-dom/src/index.ts
  var renderOptions = Object.assign(nodeOps, { patchProp });
  function render(vNode, container) {
    const renderer = createRenderer(renderOptions);
    renderer.render(vNode, container);
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-dom.global.js.map
