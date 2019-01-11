import { Record } from '@orbit/data';
import AdapterContract from "../../contracts/Adapter";
import Model from "../../contracts/Model";
import MiddlewareRegistry, { ServiceType } from "../MiddlewareRegistry";
import HiddenOrbitProp from "../../contracts/HiddenOrbitProp";
import Container from "../../contracts/Container";
import ModelSerializer from "../ModelSerializer";
import RecordSerializer from "../RecordSerializer";
import Getter from "../../contracts/Getter";
import Setter from "../../contracts/Setter";


export default class Adapter implements AdapterContract<Model> {

  private di: Container = null;

  createFromRecord<M extends Model>(record: Record, getter?: Getter<M>, setter?: Setter<M>): M {

    let registry = this.getRegistry();
    let recordSerializer = this.getRecordSerializer();
    let modelSerializer = this.getModelSerializer();

    let recordType = recordSerializer.getType(record);
    let modelKlass = this.di.getClass("models", recordType);
    let _getter = getter || this.defaultGetter;
    let _setter = setter || this.defaultSetter;

    // run beforeCreate hook
    let argsBefore = { modelKlass, record };
    registry.runHook(ServiceType.Adapter, "beforeCreate", argsBefore);
    modelKlass = argsBefore.modelKlass;
    record = argsBefore.record;

    // let the serializer create a new model instance
    let model = modelSerializer.createInstance(modelKlass);

    // run afterCreate hook
    let argsAfter = { model, getter: _getter, setter: _setter };
    registry.runHook(ServiceType.Adapter, "afterCreate", argsAfter);
    model = argsAfter.model;
    _getter = argsAfter.getter;
    _setter = argsAfter.setter;

    // fill the model's attributes with values
    let id = recordSerializer.getRemoteId(record);
    modelSerializer.setId(model, id, _setter);
    let attrs = recordSerializer.getAttributeValues(record);
    modelSerializer.setAttributeValues(model, attrs, _setter);

    // run afterCreateFill hook
    let argsFill = { model, getter: _getter, setter: _setter };
    registry.runHook(ServiceType.Adapter, "afterCreateFill", argsFill);

    return argsFill.model;
  }

  updateModel<M extends Model>(record: Record, model: M, getter?: Getter<M>, setter?: Setter<M>): void {

    let registry = this.getRegistry();
    let recordSerializer = this.getRecordSerializer();
    let modelSerializer = this.getModelSerializer();

    let _getter = getter || this.defaultGetter;
    let _setter = setter || this.defaultSetter;

    let beforeUpdate = { record, model, getter: _getter, setter: _setter };
    registry.runHook(ServiceType.Adapter, "beforeUpdate", beforeUpdate);
    record = beforeUpdate.record;
    model = beforeUpdate.model;
    _getter = beforeUpdate.getter;
    _setter = beforeUpdate.setter;

    let attrs = recordSerializer.getAttributeValues(record);
    modelSerializer.setAttributeValues(model, attrs, _setter);

    let afterUpdate = { model, getter: _getter, setter: _setter };
    registry.runHook(ServiceType.Adapter, "afterUpdate", afterUpdate);

  }

  async save<M extends Model>(model: M, getter?: Getter<M>, setter?: Setter<M>): Promise<void> {
    // todo: implement
  }

  async destroy<M extends Model>(model: M, getter?: Getter<M>, setter?: Setter<M>): Promise<void> {
    // todo: implement
  }

  _setOrbitDi(di: Container): void {
    this.di = di;
  }


  private getRegistry(): MiddlewareRegistry<HiddenOrbitProp, Model> {
    return this.di.get("middleware", "registry");
  }

  private getModelSerializer(): ModelSerializer<HiddenOrbitProp, Model> {
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
