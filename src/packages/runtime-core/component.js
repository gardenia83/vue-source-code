import { hasOwn, isFunction } from "@/shared/utils";
import { reactive } from "@/reactivity";
import { initProps } from "./componentProps";
export function createComponentInstance(vnode) {
  const instance = {
    data: null,
    isMounted: false,
    subTree: null,
    vnode,
    update: null,
    props: null,
    attrs: null,
    proxy: null,
    propsOptions: vnode.type.props || {},
  };
  return instance;
}
// 公共属性
const publicProperties = {
  $props: (i) => i.props,
  $attrs: (i) => i.attrs,
};
const PublicInstanceProxyHandlers = {
  get(target, key) {
    let { data, props, attrs } = target;
    // 优先级：data > props > attrs
    if (data && hasOwn(data, key)) {
      return data[key];
    } else if (props && hasOwn(props, key)) {
      return props[key];
    } else if (attrs && hasOwn(attrs, key)) {
      return attrs[key];
    }
    // 处理公共属性
    let getter = publicProperties[key];
    if (getter) {
      return getter(target);
    }
  },
  set(target, key, value) {
    let { data, props, attrs } = target;

    // 设置属性，遵循优先级顺序
    if (hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(props, key)) {
      props[key] = value;
      return true;
    } else if (hasOwn(attrs, key)) {
      attrs[key] = value;
      return true;
    }
  },
};
export function setupComponent(instance) {
  const { props, type } = instance.vnode;
  initProps(instance, props);
  // 创建组件实例代理对象
  instance.proxy = new Proxy(instance, PublicInstanceProxyHandlers);
  let data = type.data;
  if (data) {
    if (isFunction(data)) {
      instance.data = reactive(data.call(instance.proxy));
    }
  }
  instance.render = type.render;
}
