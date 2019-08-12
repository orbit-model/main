import { camelize } from "@orbit/utils";
import { DI } from "@orbit-model/di";
import {
  ModelMetaAccessor,
  DefaultOrbitModelReflection,
  ModelInfo,
  DefaultModelInfo
} from "@orbit-model/meta";


export default function modelGenerator(options: { name?: string } = {}) {
  return function model(target: any) {
    let diName = options.name || camelize(target.name);
    DI.register("models", diName, target);

    let mma = DI.get<ModelMetaAccessor>('system', 'modelMetaAccessor');
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


