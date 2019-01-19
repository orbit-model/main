import ModelMetaAccessors from "../ModelMetaAccessors";
import OrbitModelReflection from "../../contracts/OrbitModelReflection";

export default class DefaultModelMetaAccessor implements ModelMetaAccessors {

  getReflection(klass): OrbitModelReflection {
    return klass["__orbitModelReflection"];
  }

  setReflection(klass, meta: OrbitModelReflection): void {
    klass["__orbitModelReflection"] = meta;
  }

}
