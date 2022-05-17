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

  // packages/runtime-dom/src/patchProp.ts
  function patchProp(el, key, preValue, nextValue) {
  }

  // packages/runtime-dom/src/index.ts
  var renderOptions = Object.assign(nodeOps, { patchProp });
  console.log("renderOptions", renderOptions);
})();
//# sourceMappingURL=runtime-dom.global.js.map
