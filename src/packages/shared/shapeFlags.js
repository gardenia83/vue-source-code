/**
 * 形状标记枚举，用于快速识别和区分不同类型的VNode（虚拟节点）
 * 使用位运算标志，可以高效地组合和检查节点类型
 */
export const ShapeFlags = {
  /** 原生HTML元素 */
  ELEMENT: 1,
  /** 函数式组件 */
  FUNCTIONAL_COMPONENT: 1 << 1,
  /** 有状态组件（包含数据的组件） */
  STATEFUL_COMPONENT: 1 << 2,
  /** 文本子节点 */
  TEXT_CHILDREN: 1 << 3,
  /** 数组子节点 */
  ARRAY_CHILDREN: 1 << 4,
  /** 插槽子节点 */
  SLOTS_CHILDREN: 1 << 5,
  /** Teleport组件（传送门组件） */
  TELEPORT: 1 << 6,
  /** Suspense组件（异步组件处理） */
  SUSPENSE: 1 << 7,
  /** 组件应该被keep-alive缓存 */
  COMPONENT_SHOULD_KEEP_ALIVE: 1 << 8,
  /** 组件已经被keep-alive缓存 */
  COMPONENT_KEPT_ALIVE: 1 << 9,
  /** 组件类型（有状态组件或函数式组件的组合） */
  COMPONENT: [1 << 2, 1 << 1],
};
