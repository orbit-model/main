import Model from "../../contracts/Model";
import ApplicationDI from "../../di/ApplicationDI";
import Adapter from "../../contracts/Adapter";
import { Record } from '@orbit/data';
import ModelMetaAccessor from "../../meta/ModelMetaAccessor";

export default function ModelMixin(Base: { new(...args): any }): any {
  return class ModelMixin extends Base implements Model {
    get id(): string {
      let mma: ModelMetaAccessor = ApplicationDI.getDI().get('system', 'modelMetaAccessor');
      return mma.getMeta(this).id.remoteId;
    }
    set id(value) {
      let mma: ModelMetaAccessor = ApplicationDI.getDI().get('system', 'modelMetaAccessor');
      mma.getMeta(this).id.remoteId = value;
    }
    get type(): string {
      let mma: ModelMetaAccessor = ApplicationDI.getDI().get('system', 'modelMetaAccessor');
      return mma.getReflection(this.constructor).modelInfo.name;
    }

    destroy(): Promise<void> {
      let adapter: Adapter<Record, Model> = ApplicationDI.getDI().get("middleware", "adapter");
      return adapter.destroy(this);
    }
  };
}
