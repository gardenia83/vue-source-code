export const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, namespace, is, props) => {
    const el =
      namespace === "svg"
        ? document.createElementNS(svgNS, tag)
        : namespace === "mathml"
        ? document.createElementNS(mathmlNS, tag)
        : is
        ? document.createElement(tag, { is })
        : document.createElement(tag);

    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }

    return el;
  },
  createComment: (text) => document.createComment(text),
  createText: (text) => document.createTextNode(text),
  querySelector: (selector) => document.querySelector(selector),
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  setElementText: (el, text) => {
    el.textContent = text;
  },
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
};
