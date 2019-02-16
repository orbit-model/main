import OrbitModelReflection from "../OrbitModelReflection";
import ModelInfo from "../ModelInfo";

export default class DefaultOrbitModelReflection implements OrbitModelReflection {
  isAbstract?: boolean;
  modelInfo: ModelInfo;


  constructor(modelInfo: ModelInfo) {
    this.modelInfo = modelInfo;
  }

}
