import OrbitModelReflection from "../OrbitModelReflection";
import Model from "../../model/Model";
import OrbitModelMeta from "../OrbitModelMeta";
import ModelMetaAccessor from "../ModelMetaAccessor";


export default class DefaultModelMetaAccessor implements ModelMetaAccessor {

  /**
   * Returns the models meta data by accessing a hidden static property on a models class.
   *
   * This method may return undefined, in case no meta data could be found
   *
   * @param klass
   */
  getReflection(klass: any): OrbitModelReflection | undefined {
    return klass["__orbitModelReflection"] as OrbitModelReflection || undefined;
  }

  /**
   * Sets a new meta data pojo onto a hidden static property of the given model class.
   *
   * @param klass
   * @param meta
   */
  setReflection(klass: any, meta: OrbitModelReflection): void {
    klass["__orbitModelReflection"] = meta;
  }

  /**
   * Returns the model class instance meta data by accessing a hidden static property on a models class.
   *
   * This method may return undefined, in case no meta data could be found
   *
   * @param model
   */
  getMeta<M extends Model>(model: M): OrbitModelMeta<Model> | undefined {
    // @ts-ignore
    return model["__orbitModelMeta"];
  }

  /**
   * Sets a new meta data pojo onto a hidden static property of the given model class.
   *
   * @param model
   * @param meta
   */
  setMeta<M extends Model>(model: M, meta: OrbitModelMeta<Model>): void {
    // @ts-ignore
    model["__orbitModelMeta"] = meta;
  }

}
