import Model from "./Model";
import ApplicationDI from "../di/ApplicationDI";
import Adapter from "../middleware/Adapter";
import { Record } from '@orbit/data';
import ModelMetaAccessor from "../meta/ModelMetaAccessor";
import OrbitModelMeta from "../meta/OrbitModelMeta";

export default function ModelMixin(Base: { new(...args: any): any }): any {
  return class ModelMixin extends Base implements Model {
    __orbitModelMeta: OrbitModelMeta<Model> | undefined;

    get id(): string | undefined {
      if (!this.__orbitModelMeta) {
        return undefined;
      }
      return this.__orbitModelMeta.id.remoteId;
    }

    set id(value) {
      if (!this.__orbitModelMeta) {
        throw new Error("Orbit-Model meta data object has not been initialized yet.");
      }
      this.__orbitModelMeta.id.remoteId = value;
    }

    get type(): string {
      let mma: ModelMetaAccessor = ApplicationDI.getDI().get('system', 'modelMetaAccessor');
      let reflection = mma.getReflection(this.constructor);
      if (reflection === undefined) {
        throw new Error("Object is not a valid model: no reflection information found")
      }
      let name = reflection.modelInfo.name;
      if (name === undefined) {
        throw new Error("Object is not a valid model: reflection information is not complete")
      }
      return name;
    }


    destroy(): Promise<void> {
      let adapter: Adapter<Record, Model> = ApplicationDI.getDI().get("middleware", "adapter");
      return adapter.destroy(this);
    }
  };
}
