import { camelize } from "@orbit/utils";
import ApplicationDI from "../di/ApplicationDI";
import ModelMetaAccessors from "../meta/ModelMetaAccessors";
import DefaultOrbitModelReflection from "../meta/pojos/DefaultOrbitModelReflection";
import DefaultModelInfo from "../meta/pojos/DefaultModelInfo";
import ModelInfo from "../contracts/ModelInfo";


export default function registerClassGenerator(options: { name?: string } = {}) {
  return function registerClass(target: any) {
    let diName = options.name || camelize(target.name);
    ApplicationDI.getDI().register("models", diName, target);

    if (typeof ModelMetaAccessors.getReflection(target) === "undefined") {
      ModelMetaAccessors.setReflection(target, new DefaultOrbitModelReflection(new DefaultModelInfo()));
    }

    let modelInfo: ModelInfo = ModelMetaAccessors.getReflection(target).modelInfo;
    modelInfo.className = target.name;
    modelInfo.name = diName;
  }
}


