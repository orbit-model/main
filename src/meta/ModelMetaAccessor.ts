import OrbitModelReflection from "../contracts/OrbitModelReflection";
import Model from "../contracts/Model";
import OrbitModelMeta from "../contracts/OrbitModelMeta";


export default interface ModelMetaAccessor {

  /**
   * Returns the models meta data by accessing a hidden static property on a models class.
   *
   * This method may return undefined, in case no meta data could be found
   */
  getReflection(klass): OrbitModelReflection;

  /**
   * Sets a new meta data pojo onto a hidden static property of the given model class.
   */
  setReflection(klass, meta: OrbitModelReflection): void;

  /**
   * Returns the model class instance meta data by accessing a hidden static property on a models class.
   *
   * This method may return undefined, in case no meta data could be found
   */
  getMeta<M extends Model>(model: M): OrbitModelMeta<Model>;

  /**
   * Sets a new meta data pojo onto a hidden static property of the given model class.
   */
  setMeta<M extends Model>(model: M, meta: OrbitModelMeta<Model>): void;

}
