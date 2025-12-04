import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";
import { extend } from "../shared/utils";
import { createRenderer } from "../runtime-core";

export const rendererOptions = extend({ patchProp }, nodeOps);

export const render = (vnode, container) => {
  return createRenderer(rendererOptions).render(vnode, container);
};
