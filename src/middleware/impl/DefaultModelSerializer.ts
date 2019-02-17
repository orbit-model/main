import ModelSerializerContract from "../ModelSerializer";
import Model from "../../model/Model";
import Container from "../../di/Container";
import { Dict } from "@orbit/utils";
import { RecordIdentity } from "@orbit/data";
import { AttributeInfo } from "../../meta/ModelInfo";
import findAttributeInfoByName from "../../utils/findAttributeInfoByName";
import ModelMetaAccessor from "../../meta/ModelMetaAccessor";

export default class DefaultModelSerializer implements ModelSerializerContract<Model> {

  private di: Container | null = null;

  _setOrbitDi(di: Container): void {
    this.di = di;
  }

  getIdentity(model: Model): RecordIdentity {
    if (this.di === null) {
      throw new Error("the DefaultModelSerializer has to be instantiated through a DI container");
    }

    let mma: ModelMetaAccessor = this.di.get('system', 'modelMetaAccessor');
    let reflection = mma.getReflection(model.constructor);
    if (reflection === undefined) {
      throw new Error("The object handed to the DefaultModelSerializer is not a valid model: no reflection info found");
    }
    let type = reflection.modelInfo.name;
    if (type === undefined) {
      throw new Error("The object handed to the DefaultModelSerializer is not a valid model: reflection info not complete");
    }
    let meta = mma.getMeta(model);
    if (meta === undefined) {
      throw new Error('Model has not been initialized yet!');
    }
    return {
      id: meta.orbitUUID,
      type
    };
  }

  setAttributeValues<M extends Model>(model: M, attributes: Dict<any>): void {
    if (this.di === null) {
      throw new Error("the DefaultModelSerializer has to be instantiated through a DI container");
    }

    let mma: ModelMetaAccessor = this.di.get('system', 'modelMetaAccessor');
    let reflection = mma.getReflection(model.constructor);
    if (reflection === undefined) {
      throw new Error("The object handed to the DefaultModelSerializer is not a valid model: no reflection info found");
    }
    let meta = mma.getMeta(model);
    if (meta === undefined) {
      throw new Error('Model has not been initialized yet!');
    }

    for (let name in attributes) {
      if (attributes.hasOwnProperty(name)) {
        let attributeInfo = findAttributeInfoByName(reflection, name);

        if (attributeInfo !== undefined) {
          meta.values[attributeInfo.name] = attributes[name];
        } else {
          // todo: want to store the value anywhere else?
        }
      }
    }
  }

}

