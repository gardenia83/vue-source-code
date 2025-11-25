// 导入工具函数和模块处理函数
import { isOn, isModelListener } from "../shared/utils";
import { patchClass } from "./modules/class";
import { patchStyle } from "./modules/style";

/**
 * 属性更新的核心函数
 * @param {Element} el - 目标元素
 * @param {string} key - 属性名
 * @param {*} prevValue - 旧属性值
 * @param {*} nextValue - 新属性值
 * @param {string} namespace - 命名空间（如'svg'）
 * @param {*} parentComponent - 父组件实例
 */
export const patchProp = (
  el,
  key,
  prevValue,
  nextValue,
  namespace,
  parentComponent
) => {
  // 判断是否为SVG元素
  const isSVG = namespace === "svg";

  // 根据不同的属性类型进行相应处理
  if (key === "class") {
    // 处理class属性
    patchClass(el, nextValue, isSVG);
  } else if (key == "style") {
    // 处理style属性
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    // 处理事件绑定（以on开头的属性）

    // 排除v-model绑定的事件（如onUpdate:modelValue）
    if (!isModelListener(key)) {
      // 处理普通事件绑定
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else {
    // 其他属性和特性的处理（如attributes和properties）
    // 1. .innerHTML, .textContent等属性直接赋值
    // 2. data-* aria-* role等作为属性处理
    // 3. vue组件自定义属性
    patchAttr(el, key, nextValue, isSVG, parentComponent);
  }
};
