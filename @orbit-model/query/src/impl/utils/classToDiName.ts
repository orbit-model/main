import { dasherize } from "@orbit/utils";
import { ModelMetaAccessor } from "@orbit-model/meta";

export default function classToDiName<C = any>(klass: { new (...args: any[]): C }): string {
  let meta = ModelMetaAccessor.getReflection(klass);
  if (meta && meta.modelInfo.name) {
    return meta.modelInfo.name;
  }
  return dasherize(klass.name);
}
