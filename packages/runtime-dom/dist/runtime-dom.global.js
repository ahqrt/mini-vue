var VueRuntimeDOM = (() => {
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
  console.log("renderOptions", renderOptions);
})();
//# sourceMappingURL=runtime-dom.global.js.map
