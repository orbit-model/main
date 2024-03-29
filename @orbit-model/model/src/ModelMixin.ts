import { DefaultOrbitModelMeta, ModelMetaAccessor } from "@orbit-model/meta";
import { Branch, Model, ModelClass, ModelClassOptions, OrbitModelMeta } from "@orbit-model/contracts";
import { camelize } from "@orbit/utils";
import { Adapter } from "@orbit-model/middleware";

class Base {}

interface Json {
  [key: string]: any;
}

export default function ModelMixin(base: { new (...args: any[]): any } = Base): ModelClass<Model> {
  class ModelMixinClass extends base implements Model {
    __orbitModelMeta: OrbitModelMeta;

    constructor(branchOrOptions: Branch | ModelClassOptions, ...args: any[]) {
      super(...args);

      let klass = this.constructor;
      let type;
      let meta = ModelMetaAccessor.getReflection(klass);
      if (meta && meta.modelInfo.name) {
        type = meta.modelInfo.name;
      } else {
        type = camelize(klass.name);
      }

      let branch: Branch, uuid: string, remoteId: string | undefined;
      let branchHasOwnProperty = Object.prototype.hasOwnProperty.bind(branchOrOptions);

      if (branchHasOwnProperty("branch") && branchHasOwnProperty("uuid") && branchHasOwnProperty("ids")) {
        let options = branchOrOptions as ModelClassOptions;
        branch = options.branch;
        uuid = options.uuid;
        remoteId = options.ids.remoteId;
      } else {
        branch = branchOrOptions as Branch;
        uuid = branch.getMemorySource().schema.generateId(type);
        remoteId = undefined;
      }

      this.__orbitModelMeta = new DefaultOrbitModelMeta(branch, type, uuid, remoteId);
      ModelMetaAccessor.setMeta(this, this.__orbitModelMeta);

      branch.registerModel(this);
    }

    public get id(): string | undefined {
      return this.__orbitModelMeta.ids.remoteId;
    }

    public set id(value) {
      this.__orbitModelMeta.ids.remoteId = value;
    }

    public get type(): string {
      let reflection = ModelMetaAccessor.getReflection(this.constructor);
      if (reflection === undefined) {
        throw new Error("Object is not a valid model: no reflection information found");
      }
      let name = reflection.modelInfo.name;
      if (name === undefined) {
        throw new Error("Object is not a valid model: reflection information is not complete");
      }
      return name;
    }

    public $destroy(): Promise<void> {
      return Adapter.destroy(this);
    }

    public $save(): Promise<void> {
      return Adapter.save(this);
    }

    $isDeleted(): boolean {
      return this.__orbitModelMeta.isDeleted;
    }

    public toJSON(): Json {
      let json: Json = {
        type: this.type,
        id: this.id,
      };
      if (typeof super["toJSON"] === "function") {
        json["__super"] = super.toJSON();
      }

      let meta = ModelMetaAccessor.getMeta(this);
      if (meta) {
        for (let attr in meta.values) {
          if (Object.prototype.hasOwnProperty.call(meta.values, attr)) {
            json[attr] = meta.values[attr];
          }
        }
      }

      return json;
    }
  }

  return ModelMixinClass;
}
