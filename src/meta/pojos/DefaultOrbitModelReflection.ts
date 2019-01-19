import OrbitModelReflection from "../../contracts/OrbitModelReflection";
import ModelInfo from "../../contracts/ModelInfo";

export default class DefaultOrbitModelReflection implements OrbitModelReflection {
  isAbstract?: boolean;
  modelInfo: ModelInfo;


  constructor(modelInfo: ModelInfo) {
    this.modelInfo = modelInfo;
  }

}
