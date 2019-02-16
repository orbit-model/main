import { Record } from '@orbit/data';
import AdapterContract from "../../contracts/Adapter";
import Model from "../../contracts/Model";
import MiddlewareRegistry, { ServiceType } from "../MiddlewareRegistry";
import Container from "../../contracts/Container";
import ModelSerializer from "../ModelSerializer";
import RecordSerializer from "../RecordSerializer";
import LiteBranch from "../../contracts/LiteBranch";
import ModelMetaAccessors from "../../meta/ModelMetaAccessors";
import DefaultOrbitModelMeta from "../../meta/pojos/DefaultOrbitModelMeta";


export default class Adapter implements AdapterContract<Model> {

  private di: Container = null;

  createFromRecord<M extends Model>(record: Record, branch: LiteBranch<Model>): M {

    //let registry = this.getRegistry();
    let recordSerializer = this.getRecordSerializer();
    let modelSerializer = this.getModelSerializer();

    let recordType = recordSerializer.getType(record);

    // run beforeCreate hook
    // let argsBefore = { record, recordType };
    // registry.runHook(ServiceType.Adapter, "beforeCreate", argsBefore);
    // record = argsBefore.record;
    // recordType = argsBefore.recordType;

    // let the serializer create a new model instance
    let model: M = this.di.get<M>("models", recordType);

    let meta = new DefaultOrbitModelMeta(branch, recordType, record.id);
    meta.id.remoteId = recordSerializer.getRemoteId(record);
    ModelMetaAccessors.setMeta(model, meta);

    // run afterCreate hook
    // let argsAfter = { model, getter: _getter, setter: _setter };
    // registry.runHook(ServiceType.Adapter, "afterCreate", argsAfter);
    // model = argsAfter.model;
    // _getter = argsAfter.getter;
    // _setter = argsAfter.setter;

    // fill the model's attributes with values
    let attrs = recordSerializer.getAttributeValues(record);

    modelSerializer.setAttributeValues(model, attrs);

    // run afterCreateFill hook
    // let argsFill = { model, getter: _getter, setter: _setter };
    // registry.runHook(ServiceType.Adapter, "afterCreateFill", argsFill);
    // return argsFill.model;
    return model;
  }

  updateModel<M extends Model>(record: Record, model: M): void {
    // let registry = this.getRegistry();
    let recordSerializer = this.getRecordSerializer();
    let modelSerializer = this.getModelSerializer();

    // let beforeUpdate = { record, model, getter: _getter, setter: _setter };
    // registry.runHook(ServiceType.Adapter, "beforeUpdate", beforeUpdate);
    // record = beforeUpdate.record;
    // model = beforeUpdate.model;
    // _getter = beforeUpdate.getter;
    // _setter = beforeUpdate.setter;

    let attrs = recordSerializer.getAttributeValues(record);
    modelSerializer.setAttributeValues(model, attrs);

    // let afterUpdate = { model, getter: _getter, setter: _setter };
    // registry.runHook(ServiceType.Adapter, "afterUpdate", afterUpdate);

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
    // todo: implement
  }

  async destroy<M extends Model>(model: M): Promise<void> {
    // todo: implement
  }

  _setOrbitDi(di: Container): void {
    this.di = di;
  }


  private getRegistry(): MiddlewareRegistry<Model> {
    return this.di.get("middleware", "registry");
  }

  private getModelSerializer(): ModelSerializer<Model> {
    return this.di.get("middleware", "model-serializer");
  }

  private getRecordSerializer(): RecordSerializer {
    return this.di.get("middleware", "record-serializer");
  }

  protected defaultGetter<M extends Model>(attr: string, model: M): any {
    return model[attr];
  }

  protected defaultSetter<M extends Model>(attr: string, value: any, model: M): void {
    model[attr] = value;
  }
}
