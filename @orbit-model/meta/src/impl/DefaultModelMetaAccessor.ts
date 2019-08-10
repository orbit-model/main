import OrbitModelReflection from "../OrbitModelReflection";
import ModelMetaAccessor from "../ModelMetaAccessor";
import { MetaDataModel, OrbitModelMeta } from "@orbit-model/core";
import ApplicationDI from "@orbit-model/di";


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
  getMeta<M extends MetaDataModel>(model: M): OrbitModelMeta | undefined {
    // @ts-ignore
    return model["__orbitModelMeta"];
  }

  /**
   * Sets a new meta data pojo onto a hidden static property of the given model class.
   *
   * @param model
   * @param meta
   */
  setMeta<M extends MetaDataModel>(model: M, meta: OrbitModelMeta): void {
    Object.defineProperty(
      model, '__orbitModelMeta',
      { enumerable: false, value: meta }
    );
  }

}


ApplicationDI.getDI().register('system', 'modelMetaAccessor', DefaultModelMetaAccessor, { singleton: true });
ApplicationDI.getDI().register('orbit-model', 'modelMetaAccessor', DefaultModelMetaAccessor, { singleton: true });
