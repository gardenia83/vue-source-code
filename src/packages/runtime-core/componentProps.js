/**
 * 初始化组件实例的 props 和 attrs
 *
 * 该函数负责将传入组件的原始属性数据分离为 props 和 attrs 两部分，
 * 并将 props 转换为响应式数据以便在组件中使用
 *
 * @param {ComponentInternalInstance} instance - 组件内部实例对象
 * @param {Object | null} rawProps - 从父组件传递过来的原始属性数据
 *
 * @example
 * // 使用示例
 * initProps(instance, { title: 'Hello', id: 'main' });
 *
 * @description
 * 执行流程:
 * 1. 创建空的 props 和 attrs 对象用于存储分离后的数据
 * 2. 获取组件定义的 props 选项配置 (instance.propsOptions)
 * 3. 遍历原始属性数据，根据是否在 props 选项中定义来分类存储
 * 4. 将分类好的 props 数据转换为响应式对象
 * 5. 将处理好的数据挂载到组件实例上
 *
 * Props: 组件明确定义接收的属性，会被转换为响应式数据
 * Attrs: 组件未定义接收的属性，通常用于传递给子组件的透传属性
 */
export function initProps(instance, rawProps) {
  // 存储组件定义需要接收的属性
  const props = {};
  // 存储组件未定义接收的属性(透传属性)
  const attrs = {};
  // 获取组件的props配置选项
  const options = instance.propsOptions;

  // 如果存在传入的属性数据，则进行分类处理
  if (rawProps) {
    for (let key in rawProps) {
      const value = rawProps[key];
      // 判断属性是否在组件定义的props选项中
      if (key in options) {
        // 属于组件定义的props，存入props对象
        props[key] = value;
      } else {
        // 不属于组件定义的props，存入attrs对象(透传属性)
        attrs[key] = value;
      }
    }
  }

  // 将props转换为响应式数据并挂载到实例上
  instance.props = reactive(props);
  // 将attrs直接挂载到实例上(非响应式)
  instance.attrs = attrs;
}
