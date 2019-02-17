import { camelize } from "@orbit/utils";
import ApplicationDI from "../di/ApplicationDI";
import DefaultOrbitModelReflection from "../meta/pojos/DefaultOrbitModelReflection";
import DefaultModelInfo from "../meta/pojos/DefaultModelInfo";
import ModelInfo from "../meta/ModelInfo";
import ModelMetaAccessor from "../meta/ModelMetaAccessor";


export default function registerClassGenerator(options: { name?: string } = {}) {
  return function registerClass(target: any) {
    let diName = options.name || camelize(target.name);
    ApplicationDI.getDI().register("models", diName, target);

    let mma = ApplicationDI.getDI().get<ModelMetaAccessor>('system', 'modelMetaAccessor');
    let reflection = mma.getReflection(target);
    if (reflection === undefined) {
      reflection = new DefaultOrbitModelReflection(new DefaultModelInfo());
      mma.setReflection(target, reflection);
    }

    let modelInfo: ModelInfo = reflection.modelInfo;
    modelInfo.className = target.name;
    modelInfo.name = diName;
  }
}


