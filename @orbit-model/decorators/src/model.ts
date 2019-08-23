import { camelize } from "@orbit/utils";
import { DI } from "@orbit-model/di";
import { ModelMetaAccessor, DefaultOrbitModelReflection, DefaultModelInfo } from "@orbit-model/meta";
import { ModelInfo } from "../../contracts";

export default function modelGenerator(options: { name?: string } = {}) {
  return function model(target: any): void {
    let diName = options.name || camelize(target.name);
    DI.register("models", diName, target);

    let reflection = ModelMetaAccessor.getReflection(target);
    if (reflection === undefined) {
      reflection = new DefaultOrbitModelReflection(new DefaultModelInfo());
      ModelMetaAccessor.setReflection(target, reflection);
    }

    let modelInfo: ModelInfo = reflection.modelInfo;
    modelInfo.className = target.name;
    modelInfo.name = diName;
  };
}
