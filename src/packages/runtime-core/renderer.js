import { ShapeFlags } from "@/shared/shapeFlags";
import { isString } from "@/shared/utils";
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
    if (n1 == null) {
      mountElement(n2, container);
    }
  };
  const render = (vnode, container) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode);
      }
      // 删除节点
    } else {
      patch(container._vnode || null, vnode, container);
    }
    container._vnode = vnode;
  };
  return {
    render,
  };
}
