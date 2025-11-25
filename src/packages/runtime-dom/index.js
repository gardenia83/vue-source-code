import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";
import { extend } from "../shared/utils";

export const rendererOptions = extend({ patchProp }, nodeOps);
