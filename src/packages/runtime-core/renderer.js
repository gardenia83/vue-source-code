// 导入辅助工具和常量
import { ShapeFlags } from "@/shared/shapeFlags";
import { isString } from "@/shared/utils";
import { isSameVNodeType } from "./vnode";
import { getSequence } from "@/shared/getSequence";

/**
 * 创建渲染器的工厂函数
 * @param {Object} options - 平台特定的操作方法集合
 * @returns {Object} 包含render方法的对象
 */
export function createRenderer(options) {
  return baseCreateRenderer(options);
}

/**
 * 基础渲染器创建函数
 * @param {Object} options - 平台特定的DOM操作方法
 * @returns {Object} 渲染器对象
 */
function baseCreateRenderer(options) {
  // 解构出平台特定的DOM操作方法
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    // setText: hostSetText,
    setElementText: hostSetElementText,
    // parentNode: hostParentNode,
    // nextSibling: hostNextSibling,
    // setScopeId: hostSetScopeId,
    insertStaticContent: hostInsertStaticContent,
  } = options;

  /**
   * 处理带有key的子节点diff算法
   * @param {Array} c1 - 旧子节点数组
   * @param {Array} c2 - 新子节点数组
   * @param {HTMLElement} container - 容器元素
   */
  const patchKeyedChildren = (c1, c2, container) => {
    // 比较两个子节点(数组)差异 全量匹配
    // 同级比较 深度遍历
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null);
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    console.log(`i - ${i} e1 - ${e1} e2 - ${e2}`);
    if (i > e1) {
      // 新增子节点
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : null;
        while (i <= e2) {
          patch(null, c2[i], container, anchor);
          i++;
        }
      }
    } else if (i > e2) {
      // 删除子节点
      while (i <= e1) {
        unmount(c1[i]);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i];
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      console.log(keyToNewIndexMap);
      let j;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        let newIndex = keyToNewIndexMap.get(prevChild.key);
        if (newIndex === undefined) {
          unmount(prevChild);
        } else {
          newIndexToOldIndexMap[i - s2] = i + 1; // 对应老节点对应的索引
          patch(prevChild, c2[newIndex], container);
        }
      }
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : [];
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < c2.length ? c2[nextIndex + 1].el : null;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, anchor);
        } else {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            hostInsert(nextChild.el, container, anchor);
          } else {
            j--;
          }
        }
      }
    }
  };

  /**
   * 卸载子节点
   * @param {Array} children - 子节点数组
   * @param {HTMLElement} container - 容器元素
   */
  const unmountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      if (isString(children[i])) {
        // 如果是字符串，清空容器文本
        hostSetElementText(container, "");
      } else {
        // 否则递归卸载虚拟节点
        unmount(children[i]);
      }
    }
  };

  /**
   * 对比新旧子节点并更新
   * @param {VNode} n1 - 旧虚拟节点
   * @param {VNode} n2 - 新虚拟节点
   * @param {HTMLElement} container - 容器元素
   */
  const patchChildren = (n1, n2, container) => {
    // 获取新旧子节点
    const c1 = n1 && n1.children;
    const c2 = n2.children;
    // 获取新旧节点的形状标记
    const prevShapeFlag = n1.shapeFlag;
    const shapeFlag = n2.shapeFlag;

    // 新节点是文本子节点的情况
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 如果旧节点是数组，则卸载旧子节点
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1, container);
      }
      // 如果新旧文本不一致，则更新文本内容
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      // 新节点是数组子节点的情况
      // 旧的是子节点是数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 新的是子节点是数组
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 执行带key的子节点diff算法
          patchKeyedChildren(c1, c2, container);
        } else {
          // 旧的是数组 新的不是数组，卸载旧子节点
          unmountChildren(c1, container);
        }
      } else {
        // 旧节点是文本节点的情况
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          // 先清空容器内容
          hostSetElementText(container, "");
        }
        // 挂载新的子节点数组
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(c2, container);
        }
      }
    }
  };

  /**
   * 更新元素属性
   * @param {Object} oldProps - 旧属性对象
   * @param {Object} newProps - 新属性对象
   * @param {HTMLElement} el - DOM元素
   */
  const pathProps = (oldProps, newProps, el) => {
    if (oldProps !== newProps) {
      // 删除旧属性中不存在于新属性中的属性
      for (const key in oldProps) {
        if (!(key in newProps)) {
          hostPatchProp(el, key, oldProps[key], null);
        }
      }
      // 更新或添加新属性
      for (let key in newProps) {
        const prev = oldProps[key];
        const next = newProps[key];
        // 将新的属性覆盖旧属性（value属性特殊处理）
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next);
        }
      }
      // 特殊处理value属性
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };

  /**
   * 对比更新元素节点
   * @param {VNode} n1 - 旧虚拟节点
   * @param {VNode} n2 - 新虚拟节点
   */
  const patchElement = (n1, n2) => {
    // 复用旧元素的DOM引用
    let el = (n2.el = n1.el);
    // 获取新旧属性
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    // 更新属性
    pathProps(oldProps, newProps, el);
    // 更新子节点
    patchChildren(n1, n2, el);
  };

  /**
   * 处理元素类型的虚拟节点
   * @param {VNode|null} n1 - 旧虚拟节点
   * @param {VNode} n2 - 新虚拟节点
   * @param {HTMLElement} container - 容器元素
   */
  const processElement = (n1, n2, container, anchor) => {
    if (n1 == null) {
      // 挂载新元素
      mountElement(n2, container, anchor);
    } else {
      // 更新已有元素
      patchElement(n1, n2);
    }
  };

  /**
   * 卸载虚拟节点
   * @param {VNode} vnode - 虚拟节点
   */
  const unmount = (vnode) => hostRemove(vnode.el);

  /**
   * 挂载子节点数组
   * @param {Array} children - 子节点数组
   * @param {HTMLElement} container - 容器元素
   */
  const mountChildren = (children, container, anchor) => {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (isString(child)) {
        // 字符串节点直接创建文本节点插入
        hostInsert(hostCreateText(child), container, anchor);
      } else {
        // 递归处理子虚拟节点
        patch(null, child, container, anchor);
      }
    }
  };

  /**
   * 挂载元素节点
   * @param {VNode} vnode - 虚拟节点
   * @param {HTMLElement} container - 容器元素
   */
  const mountElement = (vnode, container, anchor) => {
    let el;
    // 解构虚拟节点属性
    const { props, type, children, shapeFlag } = vnode;
    // 创建真实DOM元素
    el = vnode.el = hostCreateElement(type);

    // 设置元素属性
    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key]);
      }
    }

    // 处理子节点
    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 数组子节点递归挂载
      mountChildren(children, el, anchor);
    } else if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 文本子节点直接设置文本
      hostSetElementText(el, children);
    }

    // 将元素插入容器
    hostInsert(el, container, anchor);
  };

  /**
   * 核心patch方法，对比新旧虚拟节点并更新DOM
   * @param {VNode|null} n1 - 旧虚拟节点
   * @param {VNode} n2 - 新虚拟节点
   * @param {HTMLElement} container - 容器元素
   */
  const patch = (n1, n2, container, anchor = null) => {
    // 相同节点直接返回
    if (n1 === n2) return;

    // 不是相同类型的节点，先卸载旧节点
    if (n1 && !isSameVNodeType(n1, n2)) {
      unmount(n1);
      n1 = null;
    }

    // vue3 源码对不同类型的vnode做了不同的处理
    // 此处仅处理元素节点
    processElement(n1, n2, container, anchor);
  };

  /**
   * 渲染入口函数
   * @param {VNode|null} vnode - 虚拟节点
   * @param {HTMLElement} container - 容器元素
   */
  const render = (vnode, container) => {
    if (vnode == null) {
      // 如果没有新节点且容器中有旧节点，则卸载旧节点
      if (container._vnode) {
        unmount(container._vnode);
      }
    } else {
      // 执行patch操作更新视图
      patch(container._vnode || null, vnode, container);
    }
    // 保存当前虚拟节点引用
    container._vnode = vnode;
  };

  // 返回渲染器接口
  return {
    render,
  };
}
