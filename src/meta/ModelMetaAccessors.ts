import OrbitModelReflection from "../contracts/OrbitModelReflection";


export default class ModelMetaAccessors {

  /**
   * Returns the models meta data by accessing a hidden static property on a models class.
   *
   * This method may return undefined, in case no meta data could be found
   *
   * @param klass
   */
  static getReflection(klass): OrbitModelReflection {
    return klass["__orbitModelReflection"];
  }

  /**
   * Sets a new meta data pojo onto a hidden static property of the given model class.
   *
   * @param klass
   * @param meta
   */
  static setReflection(klass, meta: OrbitModelReflection): void {
    klass["__orbitModelReflection"] = meta;
  }

}
