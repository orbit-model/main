import { camelize } from "@orbit/utils";
import { ModelMetaAccessor } from "@orbit-model/meta";

export default function classFunctionToDiName<C = any>(klass: Function | { new (...args: any[]): C }): string {
  let meta = ModelMetaAccessor.getReflection(klass);
  if (meta && meta.modelInfo.name) {
    return meta.modelInfo.name;
  }
  return camelize(klass.name);
}
