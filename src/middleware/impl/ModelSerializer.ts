import ModelSerializerContract from "../ModelSerializer";
import Model from "../../contracts/Model";
import Container from "../../contracts/Container";
import { Dict } from "@orbit/utils";
import { RecordIdentity } from "@orbit/data";
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
    return {
      id: ModelMetaAccessors.getMeta(model).orbitUUID,
      type: ModelMetaAccessors.getReflection(model.constructor).modelInfo.name,
    };
  }

  getAttributeValues<M extends Model>(model: M): Dict<any> {
    // todo: implement
    return undefined;
  }

  setAttributeValues<M extends Model>(model: M, attributes: Dict<any>): void {
    // let registry = this.getRegistry();
    let reflection = ModelMetaAccessors.getReflection(model.constructor);
    let meta = ModelMetaAccessors.getMeta(model);

    for (let name in attributes) {
      if (attributes.hasOwnProperty(name)) {
        let attributeInfo: AttributeInfo = findAttributeInfoByName(reflection, name);

        // let beforeSetAttr = { model, attributes, name, attributeInfo };
        // registry.runHook(ServiceType.ModelSerializer, "beforeSetAttribute", beforeSetAttr);
        // name = beforeSetAttr.name;
        // attributeInfo = beforeSetAttr.attributeInfo;

        if (attributeInfo) {
          meta.values[attributeInfo.name] = attributes[name];
        } else {
          // todo: want to store the value anywhere else?
        }
      }
    }
  }

  private getRegistry(): MiddlewareRegistry<Model> {
    return this.di.get("middleware", "registry");
  }

}

