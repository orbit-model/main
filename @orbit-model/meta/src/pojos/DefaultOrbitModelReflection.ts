import { ModelInfo, OrbitModelReflection } from "../../../contracts";

export default class DefaultOrbitModelReflection implements OrbitModelReflection {
  isAbstract?: boolean;
  modelInfo: ModelInfo;


  constructor(modelInfo: ModelInfo) {
    this.modelInfo = modelInfo;
  }

}
