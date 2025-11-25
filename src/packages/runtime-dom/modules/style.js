// 导入工具函数和常量
import { isString, isArray, hyphenate } from "@/shared/utils.js";
import { CSS_VAR_TEXT } from "../helpers/useCssVar.js";

// 匹配 display 样式的正则表达式
const displayRE = /(?:^|;)\s*display\s*:/;

/**
 * 更新元素样式
 * @param {HTMLElement} el - 目标DOM元素
 * @param {string|Object|null} prev - 旧的样式值
 * @param {string|Object|null} next - 新的样式值
 */
export function patchStyle(el, prev, next) {
  const style = el.style; // 获取元素的style对象
  const isCssString = isString(next); // 判断新样式是否为字符串
  let hasControlledDisplay = false; // 标记是否控制了display属性

  // 如果新样式存在且不为字符串（即为对象）
  if (next && !isCssString) {
    // 处理旧样式的清理工作
    if (prev) {
      // 如果旧样式也不是字符串
      if (!isString(prev)) {
        // 遍历旧样式对象，移除在新样式中不存在的属性
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      } else {
        // 如果旧样式是字符串，解析并移除在新样式中不存在的属性
        for (const prevStyle of prev.split(";")) {
          const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
    }
  } else {
    // 新样式为字符串或空值的情况
    if (isCssString) {
      // 只有当新旧样式不同时才更新
      if (prev !== next) {
        const cssVarText = style[CSS_VAR_TEXT]; // 获取CSS变量文本
        if (cssVarText) {
          // 如果存在CSS变量，将其追加到新样式中
          next += ";" + cssVarText;
        }
        style.cssText = next; // 设置元素的cssText
        hasControlledDisplay = displayRE.test(next); // 检查是否设置了display属性
      }
    } else if (prev) {
      // 如果新样式为空且旧样式存在，则移除整个style属性
      el.removeAttribute("style");
    }
    // TODO v-show的方式也要判断是否有控制display
  }
}

// 匹配 !important 的正则表达式
const importantRE = /\s*!important$/;

/**
 * 设置单个样式属性
 * @param {CSSStyleDeclaration} style - CSS样式声明对象
 * @param {string} name - 样式属性名
 * @param {string|Array} value - 样式属性值
 */
function setStyle(style, name, value) {
  // 如果值是数组，递归设置每个值
  if (isArray(value)) {
    value.forEach((v) => setStyle(style, name, v));
  } else {
    // 处理空值情况
    if (value == null) value = "";

    // 处理CSS自定义属性（以--开头）
    if (name.startsWith("--")) {
      style.setProperty(name, value);
    } else {
      // 处理普通CSS属性
      const prefixed = autoPrefix(style, name); // 添加浏览器前缀
      if (importantRE.test(value)) {
        // 处理带有!important的值
        style.setProperty(
          hyphenate(prefixed), // 转换为连字符格式
          value.replace(importantRE, ""), // 移除!important
          "important" // 设置优先级
        );
      } else {
        // 普通样式赋值
        style[prefixed] = value;
      }
    }
  }
}
