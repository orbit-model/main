import { Adapter, Model, OrbitModelMeta } from "@orbit-model/core";
import { ModelMetaAccessor } from "@orbit-model/meta";
import { DI } from "@orbit-model/di";

class Base {

}

export default function ModelMixin(base: any = Base): any {
  abstract class ModelMixin extends base implements Model {

    abstract __orbitModelMeta: OrbitModelMeta | null;

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
      let mma: ModelMetaAccessor = DI.get("system", "modelMetaAccessor");
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
      let adapter: Adapter = DI.get<Adapter>("middleware", "adapter");
      return adapter.destroy(this);
    }

    toJSON() {
      interface IJson {
        [key: string]: any;
      }

      let json: IJson = {
        type: this.type,
        id: this.id
      };
      if (typeof super["toJSON"] === "function") {
        json["__super"] = super.toJSON();
      }

      let mma: ModelMetaAccessor = DI.get("system", 'modelMetaAccessor');
      let meta = mma.getMeta(this);
      if (meta) {
        for (let attr in meta.values) {
          if (meta.values.hasOwnProperty(attr)) {
            json[attr] = meta.values[attr]
          }
        }
      }

      return json;
    }
  }

  return ModelMixin;
}
