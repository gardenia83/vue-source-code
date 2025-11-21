import { watch } from "./watch";
export function watchEffect(effect, options) {
  return watch(effect, null, options);
}
