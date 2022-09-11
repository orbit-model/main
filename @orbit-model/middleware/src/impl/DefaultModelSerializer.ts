import ModelSerializer from "@orbit-model/contracts/dist/middelware/ModelSerializer";
import findAttributeInfoByName from "./utils/findAttributeInfoByName";
import { RecordIdentity } from "@orbit/records";
import { Dict } from "@orbit/utils";
import { Container } from "@orbit-model/di";
import { ModelMetaAccessor } from "@orbit-model/meta";
import { Model } from "@orbit-model/contracts";

export default class DefaultModelSerializer implements ModelSerializer {
  private di: Container | null = null;

  _setOrbitDi(di: Container): void {
    this.di = di;
  }

  getIdentity(model: Model): RecordIdentity {
    if (this.di === null) {
      throw new Error("the DefaultModelSerializer has to be instantiated through a DI container");
    }

    let reflection = ModelMetaAccessor.getReflection(model.constructor);
    if (reflection === undefined) {
      throw new Error("The object handed to the DefaultModelSerializer is not a valid model: no reflection info found");
    }
    let type = reflection.modelInfo.name;
    if (type === undefined) {
      throw new Error(
        "The object handed to the DefaultModelSerializer is not a valid model: reflection info not complete"
      );
    }
    let meta = ModelMetaAccessor.getMeta(model);
    if (meta === undefined) {
      throw new Error("Model has not been initialized yet!");
    }
    return {
      id: meta.orbitUUID,
      type,
    };
  }

  setAttributeValues<M extends Model>(model: M, attributes: Dict<any>): void {
    if (this.di === null) {
      throw new Error("the DefaultModelSerializer has to be instantiated through a DI container");
    }

    let reflection = ModelMetaAccessor.getReflection(model.constructor);
    if (reflection === undefined) {
      throw new Error("The object handed to the DefaultModelSerializer is not a valid model: no reflection info found");
    }
    let meta = ModelMetaAccessor.getMeta(model);
    if (meta === undefined) {
      throw new Error("Model has not been initialized yet!");
    }

    for (let name in attributes) {
      if (Object.prototype.hasOwnProperty.call(attributes, name)) {
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
