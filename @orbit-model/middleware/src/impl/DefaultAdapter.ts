import ModelSerializer from "../ModelSerializer";
import RecordSerializer from "../RecordSerializer";
import { Record } from '@orbit/data';
import { Adapter, Branch, Model } from "../../../contracts";
import { Container } from "@orbit-model/di";
import { ModelMetaAccessor, DefaultOrbitModelMeta } from "@orbit-model/meta";
import classFunctionToDiName from "./utils/classFunctionToDiName";


export default class DefaultAdapter implements Adapter {

  private di: Container | null = null;

  create<M extends Model>(modelName: string | Function | { new(): M }, branch: Branch): M {
    if (this.di === null) {
      throw new Error("the DefaultAdapter has to be instantiated through a DI container");
    }

    let type: string;
    if (typeof modelName === "string") {
      type = modelName;
    } else {
      type = classFunctionToDiName<M>(modelName);
    }

    let model: M = this.di.get<M>("models", type);
    let orbitUUID = branch.getMemorySource().schema.generateId(type);
    let meta = new DefaultOrbitModelMeta(branch, type, orbitUUID);

    ModelMetaAccessor.setMeta(model, meta);
    return model;
  }

  createFromRecord<M extends Model>(record: Record, branch: Branch): M {
    if (this.di === null) {
      throw new Error("the DefaultAdapter has to be instantiated through a DI container");
    }

    let recordSerializer = this.getRecordSerializer();
    let modelSerializer = this.getModelSerializer();
    let recordType = recordSerializer.getType(record);

    let model: M = this.di.get<M>("models", recordType);

    let meta = new DefaultOrbitModelMeta(branch, recordType, recordSerializer.getID(record));
    meta.id.remoteId = recordSerializer.getRemoteId(record);
    ModelMetaAccessor.setMeta(model, meta);

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
      throw new Error('Model has not been initialized yet!');
    }
    meta.values[attribute] = value;

    let recordId = modelSerializer.getIdentity(model);
    let reflection = ModelMetaAccessor.getReflection(model.constructor);
    if (reflection === undefined) {
      throw new Error("The object handed to DefaultAdapter.setAttrValue() is not a valid model: no reflection info found");
    }
    let attrOrbitName = reflection.modelInfo.attributes[attribute].name;
    await meta.branch.getMemorySource().update(t => t.replaceKey(recordId, attrOrbitName, value))
  }


  async save<M extends Model>(model: M): Promise<void> {
    if (this.di === null) {
      throw new Error("the DefaultAdapter has to be instantiated through a DI container");
    }

    let modelSerializer = this.getModelSerializer();

    let meta = ModelMetaAccessor.getMeta(model);
    if (meta === undefined) {
      throw new Error('Model has not been initialized yet!');
    }
    let store = meta.branch.getMemorySource();

    let reflection = ModelMetaAccessor.getReflection(model.constructor);
    if (reflection === undefined) {
      throw new Error("The object handed to DefaultAdapter.save() is not a valid model: no reflection info found");
    }
    let attributeInfos = reflection.modelInfo.attributes;
    let promises: Promise<any>[] = [];
    for (let attribute in attributeInfos) {
      let value = meta.values[attribute];
      let recordId = modelSerializer.getIdentity(model);
      let attrOrbitName = attributeInfos[attribute].name;
      promises.push(store.update(t => t.replaceKey(recordId, attrOrbitName, value)));
    }
    await Promise.all(promises);
  }

  async destroy<M extends Model>(model: M): Promise<void> {
    if (this.di === null) {
      throw new Error("the DefaultAdapter has to be instantiated through a DI container");
    }

    let modelSerializer = this.getModelSerializer();
    let meta = ModelMetaAccessor.getMeta(model);
    if (meta === undefined) {
      throw new Error('Model has not been initialized yet!');
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

