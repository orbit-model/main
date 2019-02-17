import Model from "./Model";
import ApplicationDI from "../di/ApplicationDI";
import Adapter from "../middleware/Adapter";
import { Record } from '@orbit/data';
import ModelMetaAccessor from "../meta/ModelMetaAccessor";
import OrbitModelMeta from "../meta/OrbitModelMeta";
import DefaultOrbitModelMeta from "../meta/pojos/DefaultOrbitModelMeta";
import Branch from "../branching/Branch";

export default function ModelMixin(Base: { new(...args: any): any }): any {
  return class ModelMixin extends Base implements Model {
    __orbitModelMeta: OrbitModelMeta<Model>;

    constructor(branch: Branch<Model>, className: string, orbitUUID: string, ...args: any) {
      super(...args);
      this.__orbitModelMeta = new DefaultOrbitModelMeta(branch, className, orbitUUID);
    }

    get id(): string | undefined {
      let mma = ApplicationDI.getDI().get<ModelMetaAccessor>('system', 'modelMetaAccessor');
      return mma.getMeta(this).id.remoteId;
    }

    set id(value) {
      let mma: ModelMetaAccessor = ApplicationDI.getDI().get('system', 'modelMetaAccessor');
      mma.getMeta(this).id.remoteId = value;
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
