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
    createRenderer: () => createRenderer,
    h: () => h,
    render: () => render
  });

  // packages/runtime-core/src/renderer.ts
  function createRenderer(renderOptions2) {
    const render2 = (vNode, container) => {
    };
    return {
      render: render2
    };
  }

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return value !== null && typeof value === "object";
  };
  var isString = (value) => {
    return typeof value === "string";
  };
  var isArray = Array.isArray;

  // packages/runtime-core/src/vnode.ts
  function isVNode(value) {
    return !!(value && value.__v_isVNode);
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
      return vNode;
    }
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
        return createVNode(type, null, children);
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
