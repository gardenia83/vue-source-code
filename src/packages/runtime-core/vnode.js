import { isString, isObject } from "../shared/utils";
import { ShapeFlags } from "../shared/shapeFlags";
export function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
export const Text = Symbol.for("v-txt");
export const Fragment = Symbol.for("v-fgt");
export function createVNode(type, props, children = null) {
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0;
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
export function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
