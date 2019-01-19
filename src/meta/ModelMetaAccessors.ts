import OrbitModelReflection from "../contracts/OrbitModelReflection";


export default interface ModelMetaAccessors {

  /**
   * Returns the models meta data by accessing a hidden static property on a models class.
   *
   * This method may return undefined, in case no meta data could be found
   *
   * @param klass
   */
  getReflection(klass): OrbitModelReflection;

  /**
   * Sets a new meta data pojo onto a hidden static property of the given model class.
   *
   * @param klass
   * @param meta
   */
  setReflection(klass, meta: OrbitModelReflection): void;

}
