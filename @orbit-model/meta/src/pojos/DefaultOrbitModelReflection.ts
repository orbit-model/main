import { ModelInfo, OrbitModelReflection } from "@orbit-model/core";

export default class DefaultOrbitModelReflection implements OrbitModelReflection {
  isAbstract?: boolean;
  modelInfo: ModelInfo;


  constructor(modelInfo: ModelInfo) {
    this.modelInfo = modelInfo;
  }

}
