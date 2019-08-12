import OrbitModelReflection from "@orbit-model/core/dist/OrbitModelReflection";
import ModelInfo from "@orbit-model/core/dist/ModelInfo";

export default class DefaultOrbitModelReflection implements OrbitModelReflection {
  isAbstract?: boolean;
  modelInfo: ModelInfo;


  constructor(modelInfo: ModelInfo) {
    this.modelInfo = modelInfo;
  }

}
