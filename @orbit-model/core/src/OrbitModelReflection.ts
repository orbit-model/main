import { ModelInfo } from "./ModelInfo";

export default interface OrbitModelReflection {
  isAbstract?: boolean; // todo: do we need this???
  modelInfo: ModelInfo;
}
