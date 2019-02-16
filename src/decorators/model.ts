import { camelize } from "@orbit/utils";
import ApplicationDI from "../di/ApplicationDI";
import DefaultOrbitModelReflection from "../meta/pojos/DefaultOrbitModelReflection";
import DefaultModelInfo from "../meta/pojos/DefaultModelInfo";
import ModelInfo from "../contracts/ModelInfo";
import ModelMetaAccessor from "../meta/ModelMetaAccessor";


export default function registerClassGenerator(options: { name?: string } = {}) {
  return function registerClass(target: any) {
    let diName = options.name || camelize(target.name);
    ApplicationDI.getDI().register("models", diName, target);

    let mma: ModelMetaAccessor = ApplicationDI.getDI().get('system', 'modelMetaAccessor');
    if (typeof mma.getReflection(target) === "undefined") {
      mma.setReflection(target, new DefaultOrbitModelReflection(new DefaultModelInfo()));
    }

    let modelInfo: ModelInfo = mma.getReflection(target).modelInfo;
    modelInfo.className = target.name;
    modelInfo.name = diName;
  }
}


