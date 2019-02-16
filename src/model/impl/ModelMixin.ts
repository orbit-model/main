import Model from "../../contracts/Model";
import ApplicationDI from "../../di/ApplicationDI";
import Adapter from "../../contracts/Adapter";
import { Record } from '@orbit/data';
import ModelMetaAccessors from "../../meta/ModelMetaAccessors";

export default function ModelMixin(Base: { new(...args): any }): any {
  return class ModelMixin extends Base implements Model {
    get id(): string {
      return ModelMetaAccessors.getMeta(this).id.remoteId;
    }
    set id(value) {
      ModelMetaAccessors.getMeta(this).id.remoteId = value;
    }
    get type(): string {
      return ModelMetaAccessors.getReflection(this.constructor).modelInfo.name;
    }

    destroy(): Promise<void> {
      let adapter: Adapter<Record, Model> = ApplicationDI.getDI().get("middleware", "adapter");
      return adapter.destroy(this);
    }
  };
}
