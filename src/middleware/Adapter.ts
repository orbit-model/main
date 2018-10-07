import { Record } from '@orbit/data';
import AdapterContract from "../contracts/Adapter";
import Model from "../contracts/Model";
import MiddlewareRegistry from "./contracts/MiddlewareRegistry";
import HiddenOrbitProp from "../contracts/HiddenOrbitProp";
import Container from "../contracts/Container";
import ModelSerializer from "./contracts/ModelSerializer";
import RecordSerializer from "./contracts/RecordSerializer";
import OrbitReflection from "../contracts/OrbitReflection";
import { Dict } from "@orbit/utils";
import { AttributeInfo } from "../contracts/ModelInfo";
import findAttributeInfoByName from "../utils/findAttributeInfoByName";


export default class Adapter implements AdapterContract<Model> {

  private di: Container = null;

  createFromRecord<M extends Model>(record: Record, setter?: (attr: string, value: any, model: M) => void): M {
    let registry = this.getRegistry();
    let recordSerializer = this.getRecordSerializer();
    let modelSerializer = this.getModelSerializer();

    let recordType = recordSerializer.getType(record);
    let modelKlass = this.di.getClass("models", recordType);
    let modelSetter = setter || this.defaultSetter;

    // run beforeCreate hook
    let argsBefore = { modelKlass, record };
    registry.runHooks("beforeCreate", argsBefore);
    modelKlass = argsBefore.modelKlass;
    record = argsBefore.record;

    // let the serializer create a new model instance
    let model = modelSerializer.createInstance(modelKlass);

    // run afterCreate hook
    let argsAfter = { model, setter: modelSetter };
    registry.runHooks("afterCreate", argsAfter);
    model = argsAfter.model;
    modelSetter = argsAfter.setter;

    // fill the model's attributes with values
    let reflection = modelSerializer.getOrbitReflection(modelKlass);
    let attrs = recordSerializer.getAttributeValues(record);
    this.initialModelFill(attrs, reflection, modelSetter, model);

    // run afterCreateFill hook
    let argsFill = { model, setter: modelSetter };
    registry.runHooks("afterCreateFill", argsFill);

    return argsFill.model;
  }

  private initialModelFill(attrs: Dict<any>, reflection: OrbitReflection, modelSetter, model) {
    for (let attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        let attrInfo: AttributeInfo = findAttributeInfoByName(reflection, attr);
        if (attrInfo) {
          modelSetter(attrInfo.attributeName, attrs[attr], model);
        } else {
          // todo: want to store the value anywhere else?
        }
      }
    }
  }


  destroy<M extends Model>(model: M, getter?: (attr: string, model?: M) => any): Promise<void> {
    return undefined;
  }

  save<M extends Model>(model: M, getter?: (attr: string, model?: M) => any): Promise<void> {
    return undefined;
  }

  updateModel<M extends Model>(record: Record, model: M, getter?: (attr: string, model?: M) => any, setter?: (attr: string, value: any, model?: M) => void): void {
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

  protected defaultSetter<M extends Model>(attr: string, value: any, model: M): void {
    model[attr] = value;
  }
}
