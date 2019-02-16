import ModelSerializerContract from "../ModelSerializer";
import Model from "../../model/Model";
import Container from "../../di/Container";
import { Dict } from "@orbit/utils";
import { RecordIdentity } from "@orbit/data";
import { AttributeInfo } from "../../contracts/ModelInfo";
import findAttributeInfoByName from "../../utils/findAttributeInfoByName";
import ModelMetaAccessor from "../../meta/ModelMetaAccessor";

export default class DefaultModelSerializer implements ModelSerializerContract<Model> {

  private di: Container;

  _setOrbitDi(di: Container): void {
    this.di = di;
  }

  getIdentity(model: Model): RecordIdentity {
    let mma: ModelMetaAccessor = this.di.get('system', 'modelMetaAccessor');
    return {
      id: mma.getMeta(model).orbitUUID,
      type: mma.getReflection(model.constructor).modelInfo.name,
    };
  }

  getAttributeValues<M extends Model>(model: M): Dict<any> {
    // todo: implement
    return undefined;
  }

  setAttributeValues<M extends Model>(model: M, attributes: Dict<any>): void {
    let mma: ModelMetaAccessor = this.di.get('system', 'modelMetaAccessor');
    let reflection = mma.getReflection(model.constructor);
    let meta = mma.getMeta(model);

    for (let name in attributes) {
      if (attributes.hasOwnProperty(name)) {
        let attributeInfo: AttributeInfo = findAttributeInfoByName(reflection, name);

        if (attributeInfo) {
          meta.values[attributeInfo.name] = attributes[name];
        } else {
          // todo: want to store the value anywhere else?
        }
      }
    }
  }

}

