export function isObject(value) {
  return typeof value === "object" && value !== null;
}
export function isArray(target) {
  return Array.isArray(target);
}
export function isFunction(value) {
  return typeof value === "function";
}
