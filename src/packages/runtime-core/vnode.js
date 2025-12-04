import { isString } from "../shared/utils";
import { ShapeFlags } from "../shared/shapeFlags";
export function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}

export function createVNode(type, props, children = null) {
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0;

  const vnode = {
    __v_isVNode: true, // 用来判断是否是虚拟节点
    type,
    props,
    children,
    shapeFlag,
    key: props?.key,
    el: null,
  };
  if (children) {
    vnode.shapeFlag |= isString(children)
      ? ShapeFlags.TEXT_CHILDREN
      : ShapeFlags.ARRAY_CHILDREN;
  }
  return vnode;
}
