import ModelSerializerContract from "../ModelSerializer";
import Model from "../../contracts/Model";
import Container from "../../contracts/Container";
import Getter from "../../contracts/Getter";
import { Dict } from "@orbit/utils";
import { RecordIdentity } from "@orbit/data";
import Setter from "../../contracts/Setter";
import { AttributeInfo } from "../../contracts/ModelInfo";
import findAttributeInfoByName from "../../utils/findAttributeInfoByName";
import { ServiceType } from "../MiddlewareRegistry";
import MiddlewareRegistry from "../MiddlewareRegistry";
import ModelMetaAccessors from "../../meta/ModelMetaAccessors";

export default class ModelSerializer implements ModelSerializerContract<Model> {

  private di: Container;

  _setOrbitDi(di: Container): void {
    this.di = di;
  }

  getIdentity(model: Model): RecordIdentity {
    return undefined;
  }


  getAttributeValues<M extends Model>(model: M, getter: Getter<M>): Dict<any> {
    return undefined;
  }

  setAttributeValues<M extends Model>(model: M, attributes: Dict<any>, setter: Setter<M>): void {
    let registry = this.getRegistry();
    let reflection = ModelMetaAccessors.getReflection(model.constructor);

    for (let name in attributes) {
      if (attributes.hasOwnProperty(name)) {
        let attributeInfo: AttributeInfo = findAttributeInfoByName(reflection, name);

        let beforeSetAttr = { model, attributes, setter, name, attributeInfo };
        registry.runHook(ServiceType.ModelSerializer, "beforeSetAttribute", beforeSetAttr);
        name = beforeSetAttr.name;
        attributeInfo = beforeSetAttr.attributeInfo;

        if (attributeInfo) {
          setter(attributeInfo.attributeName, attributes[name], model);
        } else {
          // todo: want to store the value anywhere else?
        }
      }
    }
  }


  getId<M extends Model>(model: M, getter: Getter<M>): string {
    return getter("id", model);
  }

  setId<M extends Model>(model: M, value: string, setter: Setter<M>) {
    setter("id", value, model);
  }

  private getRegistry(): MiddlewareRegistry<Model> {
    return this.di.get("middleware", "registry");
  }

}

