import { dasherize } from "@orbit/utils";
import ModelMetaAccessors from "../meta/ModelMetaAccessors";

export default function classToDiName<C = any>(klass: { new(...args): C }) {
  let meta = ModelMetaAccessors.getReflection(klass);
  if (meta) {
    return meta.modelInfo.name;
  }
  return dasherize(klass.name);
}
