import { dasherize } from "@orbit/utils";
import ModelMetaAccessor from "../meta/ModelMetaAccessor";
import ApplicationDI from "../di/ApplicationDI";

export default function classToDiName<C = any>(klass: { new(...args: any[]): C }): string {
  let mma: ModelMetaAccessor = ApplicationDI.getDI().get('system', 'modelMetaAccessor');
  let meta = mma.getReflection(klass);
  if (meta && meta.modelInfo.name) {
    return meta.modelInfo.name;
  }
  return dasherize(klass.name);
}
