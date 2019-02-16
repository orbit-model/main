import { Record } from '@orbit/data';
import Adapter from "../Adapter";
import Model from "../../model/Model";
import Container from "../../di/Container";
import ModelSerializer from "../ModelSerializer";
import RecordSerializer from "../RecordSerializer";
import Branch from "../../branching/Branch";
import DefaultOrbitModelMeta from "../../meta/pojos/DefaultOrbitModelMeta";
import ModelMetaAccessor from "../../meta/ModelMetaAccessor";


export default class DefaultAdapter implements Adapter<Record, Model> {

  private di: Container = null;

  createFromRecord<M extends Model>(record: Record, branch: Branch<Model>): M {

    let recordSerializer = this.getRecordSerializer();
    let modelSerializer = this.getModelSerializer();
    let mma: ModelMetaAccessor = this.di.get('system', 'modelMetaAccessor');

    let recordType = recordSerializer.getType(record);

    // let the serializer create a new model instance
    let model: M = this.di.get<M>("models", recordType);

    let meta = new DefaultOrbitModelMeta(branch, recordType, recordSerializer.getID(record));
    meta.id.remoteId = recordSerializer.getRemoteId(record);
    mma.setMeta(model, meta);

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
    let mma: ModelMetaAccessor = this.di.get('system', 'modelMetaAccessor');

    let meta = mma.getMeta(model);
    meta.values[attribute] = value;

    let recordId = modelSerializer.getIdentity(model);
    let attrOrbitName = mma.getReflection(model.constructor).modelInfo.attributes[attribute].name;
    await meta.branch.getStore().update(t => t.replaceKey(recordId, attrOrbitName, value))
  }


  async save<M extends Model>(model: M): Promise<void> {
    let modelSerializer = this.getModelSerializer();
    let mma: ModelMetaAccessor = this.di.get('system', 'modelMetaAccessor');

    let meta = mma.getMeta(model);
    let store = meta.branch.getStore();

    let attributeInfos = mma.getReflection(model.constructor).modelInfo.attributes;
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
    let mma: ModelMetaAccessor = this.di.get('system', 'modelMetaAccessor');
    let meta = mma.getMeta(model);
    let store = meta.branch.getStore();

    let recordId = modelSerializer.getIdentity(model);
    await store.update(t => t.removeRecord(recordId));
  }

  _setOrbitDi(di: Container): void {
    this.di = di;
  }


  private getModelSerializer(): ModelSerializer<Model> {
    return this.di.get("middleware", "modelSerializer");
  }

  private getRecordSerializer(): RecordSerializer<Record> {
    return this.di.get("middleware", "recordSerializer");
  }
}
