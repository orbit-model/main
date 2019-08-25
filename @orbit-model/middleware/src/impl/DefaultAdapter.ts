import ModelSerializer from "../ModelSerializer";
import RecordSerializer from "../RecordSerializer";
import { Record } from "@orbit/data";
import { Container } from "@orbit-model/di";
import { ModelMetaAccessor } from "@orbit-model/meta";
import { Adapter, Branch, Model, ModelClass, ModelClassOptions } from "@orbit-model/contracts";

export default class DefaultAdapter implements Adapter {
  private di: Container | null = null;

  create<M extends Model>(nameOrClass: string | ModelClass<M>, branch: Branch, options?: { args?: any[] }): M {
    if (this.di === null) {
      throw new Error("the DefaultAdapter has to be instantiated through a DI container");
    }

    let args: any[] = [];
    if (options && options.args) {
      args = options.args;
    }

    if (typeof nameOrClass === "string") {
      return this.di.get<M>("models", nameOrClass, {
        args: [branch, ...args]
      });
    }

    return new nameOrClass(branch, ...args);
  }

  createFromRecord<M extends Model>(record: Record, branch: Branch, options?: { args?: any[] }): M {
    if (this.di === null) {
      throw new Error("the DefaultAdapter has to be instantiated through a DI container");
    }

    let args: any[] = [];
    if (options && options.args) {
      args = options.args;
    }

    let recordSerializer = this.getRecordSerializer();
    let modelSerializer = this.getModelSerializer();
    let recordType = recordSerializer.getType(record);

    let modelClassOptions: ModelClassOptions = {
      branch,
      uuid: recordSerializer.getID(record),
      ids: {}
    };
    let remoteId = recordSerializer.getRemoteId(record);
    if (remoteId) {
      modelClassOptions.ids.remoteId = remoteId;
    }

    let model: M = this.di.get<M>("models", recordType, {
      args: [modelClassOptions, ...args]
    });

    // fill the model's attributes with values
    let attrs = recordSerializer.getAttributeValues(record);
    modelSerializer.setAttributeValues(model, attrs);
    return model;
  }

  updateModel<M extends Model>(record: Record, model: M): void {
    if (this.di === null) {
      throw new Error("the DefaultAdapter has to be instantiated through a DI container");
    }

    let recordSerializer = this.getRecordSerializer();
    let modelSerializer = this.getModelSerializer();

    let attrs = recordSerializer.getAttributeValues(record);
    modelSerializer.setAttributeValues(model, attrs);
  }

  async setAttrValue<M extends Model>(model: M, attribute: string, value: any): Promise<void> {
    if (this.di === null) {
      throw new Error("the DefaultAdapter has to be instantiated through a DI container");
    }

    let modelSerializer = this.getModelSerializer();

    let meta = ModelMetaAccessor.getMeta(model);
    if (meta === undefined) {
      throw new Error("Model has not been initialized yet!");
    }
    meta.values[attribute] = value;

    let recordId = modelSerializer.getIdentity(model);
    let reflection = ModelMetaAccessor.getReflection(model.constructor);
    if (reflection === undefined) {
      throw new Error(
        "The object handed to DefaultAdapter.setAttrValue() is not a valid model: no reflection info found"
      );
    }
    let attrOrbitName = reflection.modelInfo.attributes[attribute].name;
    await meta.branch.getMemorySource().update(t => t.replaceKey(recordId, attrOrbitName, value));
  }

  async save<M extends Model>(model: M): Promise<void> {
    if (this.di === null) {
      throw new Error("the DefaultAdapter has to be instantiated through a DI container");
    }

    let modelSerializer = this.getModelSerializer();

    let meta = ModelMetaAccessor.getMeta(model);
    if (meta === undefined) {
      throw new Error("Model has not been initialized yet!");
    }
    let store = meta.branch.getMemorySource();

    let reflection = ModelMetaAccessor.getReflection(model.constructor);
    if (reflection === undefined) {
      throw new Error("The object handed to DefaultAdapter.save() is not a valid model: no reflection info found");
    }
    let attributeInfos = reflection.modelInfo.attributes;
    let record: Record = modelSerializer.getIdentity(model);
    record["attributes"] = {};
    for (let attribute in attributeInfos) {
      let value = meta.values[attribute];
      let attrOrbitName = attributeInfos[attribute].name;
      record.attributes[attrOrbitName] = value;
    }

    // do save
    if (typeof meta.ids.remoteId === "undefined") {
      let tmpRecord = store.cache.getRecordSync(record);
      if (tmpRecord === undefined) {
        await store.update(t => t.addRecord(record));
      } else {
        await store.update(t => t.updateRecord(record));
      }
    } else {
      record["keys"] = {
        remoteId: meta.ids.remoteId
      };
      await store.update(t => t.updateRecord(record));
    }
  }

  async destroy<M extends Model>(model: M): Promise<void> {
    if (this.di === null) {
      throw new Error("the DefaultAdapter has to be instantiated through a DI container");
    }

    let modelSerializer = this.getModelSerializer();
    let meta = ModelMetaAccessor.getMeta(model);
    if (meta === undefined) {
      throw new Error("Model has not been initialized yet!");
    }
    let store = meta.branch.getMemorySource();

    let recordId = modelSerializer.getIdentity(model);
    await store.update(t => t.removeRecord(recordId));
  }

  _setOrbitDi(di: Container): void {
    this.di = di;
  }

  private getModelSerializer(): ModelSerializer {
    if (this.di === null) {
      throw new Error("the DefaultAdapter has to be instantiated through a DI container");
    }
    return this.di.get("system", "ModelSerializer");
  }

  private getRecordSerializer(): RecordSerializer {
    if (this.di === null) {
      throw new Error("the DefaultAdapter has to be instantiated through a DI container");
    }
    return this.di.get("system", "RecordSerializer");
  }
}
