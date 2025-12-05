import { ShapeFlags } from "@/shared/shapeFlags";
import { isString } from "@/shared/utils";
import { isSameVNodeType } from "./vnode";
export function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options) {
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId,
    insertStaticContent: hostInsertStaticContent,
  } = options;
  const patchKeyedChildren = (c1, c2, container) => {
    // 比较两个子节点(数组)差异
  };
  const unmountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      if (isString(children[i])) {
        hostSetElementText(container, "");
      } else {
        unmount(children[i]);
      }
    }
  };
  const patchChildren = (n1, n2, container) => {
    const c1 = n1 && n1.children;
    const c2 = n2.children;
    const prevShapeFlag = n1.shapeFlag;
    const shapeFlag = n2.shapeFlag;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1, container);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      // 旧的是子节点是数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 新的是子节点是数组
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          patchKeyedChildren(c1, c2, container);
        } else {
          // 旧的是数组 新的不是数组
          unmountChildren(c1, container);
        }
      } else {
        // 旧是文本 先清空
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(container, "");
        }
        // 挂载新的子节点
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(c2, container);
        }
      }
    }
  };
  const pathProps = (oldProps, newProps, el) => {
    if (oldProps !== newProps) {
      // 删除旧属性
      for (const key in oldProps) {
        if (!(key in newProps)) {
          hostPatchProp(el, key, oldProps[key], null);
        }
      }
      for (let key in newProps) {
        const prev = oldProps[key];
        const next = newProps[key];
        // 将新的属性覆盖旧属性
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next);
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };
  const patchElement = (n1, n2) => {
    let el = (n2.el = n1.el);
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    pathProps(oldProps, newProps, el);
    patchChildren(n1, n2, el);
  };
  const processElement = (n1, n2, container) => {
    if (n1 == null) {
      mountElement(n2, container);
    } else {
      patchElement(n1, n2);
    }
  };
  const unmount = (vnode) => hostRemove(vnode.el);
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (isString(child)) {
        hostInsert(hostCreateText(child), container);
      } else {
        patch(null, child, container);
      }
    }
  };
  const mountElement = (vnode, container) => {
    let el;
    const { props, type, children, shapeFlag } = vnode;
    el = vnode.el = hostCreateElement(type);
    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key]);
      }
    }
    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el);
    } else if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children);
    }
    hostInsert(el, container);
  };
  const patch = (n1, n2, container) => {
    if (n1 === n2) return;
    if (n1 && !isSameVNodeType(n1, n2)) {
      unmount(n1);
      n1 = null;
    }
    // vue3 源码对不同类型的vnode做了不同的处理
    // 此处仅处理元素节点
    processElement(n1, n2, container);
  };
  const render = (vnode, container) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode);
      }
    } else {
      patch(container._vnode || null, vnode, container);
    }
    container._vnode = vnode;
  };
  return {
    render,
  };
}
