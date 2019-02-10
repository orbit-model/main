import OrbitModelReflection from "../contracts/OrbitModelReflection";
import HiddenOrbit from "../contracts/HiddenOrbit";
import Model from "../contracts/Model";


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

  /**
   * Returns the model class instance meta data by accessing a hidden static property on a models class.
   *
   * This method may return undefined, in case no meta data could be found
   *
   * @param model
   */
  static getMeta<M extends Model>(model: M): HiddenOrbit {
    return model["__orbitModel"];
  }

  /**
   * Sets a new meta data pojo onto a hidden static property of the given model class.
   *
   * @param model
   * @param meta
   */
  static setMeta<M extends Model>(model: M, meta: HiddenOrbit): void {
    model["__orbitModel"] = meta;
  }

}
