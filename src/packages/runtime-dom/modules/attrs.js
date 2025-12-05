import {
  isSpecialBooleanAttr,
  includeBooleanAttr,
  isSymbol,
} from "@/shared/utils";
export const XLINK_NS = "http://www.w3.org/1999/xlink";
export function patchAttr(el, key, value, isSVG, instance, isBoolean) {
  isBoolean = isBoolean == null ? isSpecialBooleanAttr(key) : isBoolean;
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(XLINK_NS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(XLINK_NS, key, value);
    }
  } else {
    if (value == null || (isBoolean && !includeBooleanAttr(value))) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}
