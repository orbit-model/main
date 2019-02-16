import { Record } from '@orbit/data';
import Adapter from "../../contracts/Adapter";
import Model from "../../contracts/Model";
import Container from "../../contracts/Container";
import ModelSerializer from "../ModelSerializer";
import RecordSerializer from "../RecordSerializer";
import LiteBranch from "../../contracts/LiteBranch";
import ModelMetaAccessors from "../../meta/ModelMetaAccessors";
import DefaultOrbitModelMeta from "../../meta/pojos/DefaultOrbitModelMeta";


export default class DefaultAdapter implements Adapter<Record, Model> {

  private di: Container = null;

  createFromRecord<M extends Model>(record: Record, branch: LiteBranch<Model>): M {

    let recordSerializer = this.getRecordSerializer();
    let modelSerializer = this.getModelSerializer();

    let recordType = recordSerializer.getType(record);

    // let the serializer create a new model instance
    let model: M = this.di.get<M>("models", recordType);

    let meta = new DefaultOrbitModelMeta(branch, recordType, recordSerializer.getID(record));
    meta.id.remoteId = recordSerializer.getRemoteId(record);
    ModelMetaAccessors.setMeta(model, meta);

    // fill the model's attributes with values
    let attrs = recordSerializer.getAttributeValues(record);

    modelSerializer.setAttributeValues(model, attrs);

    return model;
  }

  updateModel<M extends Model>(record: Record, model: M): void {
    let recordSerializer = this.getRecordSerializer();
    let modelSerializer = this.getModelSerializer();

    let attrs = recordSerializer.getAttributeValues(record);
    modelSerializer.setAttributeValues(model, attrs);
  }

  async setAttrValue<M extends Model>(model: M, attribute: string, value: any): Promise<void> {
    let modelSerializer = this.getModelSerializer();

    let meta = ModelMetaAccessors.getMeta(model);
    meta.values[attribute] = value;

    let recordId = modelSerializer.getIdentity(model);
    let attrOrbitName = ModelMetaAccessors.getReflection(model.constructor).modelInfo.attributes[attribute].name;
    await meta.branch.getStore().update(t => t.replaceKey(recordId, attrOrbitName, value))
  }


  async save<M extends Model>(model: M): Promise<void> {
    let modelSerializer = this.getModelSerializer();

    let meta = ModelMetaAccessors.getMeta(model);
    let store = meta.branch.getStore();

    let attributeInfos = ModelMetaAccessors.getReflection(model.constructor).modelInfo.attributes;
    let promises: Promise<any>[] = [];
    for(let attribute in attributeInfos){
      let value = meta.values[attribute];
      let recordId = modelSerializer.getIdentity(model);
      let attrOrbitName = attributeInfos[attribute].name;
      promises.push(store.update(t => t.replaceKey(recordId, attrOrbitName, value)));
    }
    await Promise.all(promises);
  }

  async destroy<M extends Model>(model: M): Promise<void> {
    let modelSerializer = this.getModelSerializer();
    let meta = ModelMetaAccessors.getMeta(model);
    let store = meta.branch.getStore();

    let recordId = modelSerializer.getIdentity(model);
    await store.update(t => t.removeRecord(recordId));
  }

  _setOrbitDi(di: Container): void {
    this.di = di;
  }


  private getModelSerializer(): ModelSerializer<Model> {
    return this.di.get("middleware", "model-serializer");
  }

  private getRecordSerializer(): RecordSerializer<Record> {
    return this.di.get("middleware", "record-serializer");
  }
}
