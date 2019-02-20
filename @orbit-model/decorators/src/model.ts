import { camelize } from "@orbit/utils";
import { Model } from "@orbit-model/core";
import ApplicationDI from "@orbit-model/di";
import {
  ModelMetaAccessor,
  DefaultOrbitModelReflection,
  ModelInfo,
  DefaultModelInfo
} from "@orbit-model/meta";


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


