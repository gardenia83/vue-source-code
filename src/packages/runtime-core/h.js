import { isObject, isArray } from "@/shared/utils";
import { createVNode, isVNode } from "./vnode";
/**
 * 创建虚拟节点(VNode)的工厂函数
 * @param {string|Component} type - 节点类型，可以是HTML标签名或组件
 * @param {Object|null} propsOrChildren - 属性对象或子节点
 * @param {Array|VNode} children - 子节点数组或单个子节点
 * @returns {VNode} 返回创建的虚拟节点
 */
export function h(type, propsOrChildren, children) {
  const l = arguments.length;
  // 处理两个参数的情况
  if (l === 2) {
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      // 如果第二个参数是对象且不是数组，判断是否为VNode
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    // 处理三个及以上参数的情况
    if (l > 3) {
      // 当参数超过3个时，将第3个及之后的参数收集为子节点数组
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      // 当有3个参数且第三个参数是VNode时，将其包装为数组
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
