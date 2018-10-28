import ModelSerializerContract from "./contracts/ModelSerializer";
import Model from "../contracts/Model";
import HiddenOrbitProp from "../contracts/HiddenOrbitProp";
import Container from "../contracts/Container";
import Getter from "../contracts/Getter";
import { Dict } from "@orbit/utils";
import HiddenOrbit from "../contracts/HiddenOrbit";
import { RecordIdentity } from "@orbit/data";
import OrbitReflection from "../contracts/OrbitReflection";
import Setter from "../contracts/Setter";
import { AttributeInfo } from "../contracts/ModelInfo";
import findAttributeInfoByName from "../utils/findAttributeInfoByName";
import MiddlewareRegistry, { ServiceType } from "./contracts/MiddlewareRegistry";

export default class ModelSerializer implements ModelSerializerContract<HiddenOrbitProp, Model> {

  private di: Container;

  _setOrbitDi(di: Container): void {
    this.di = di;
  }

  createInstance<M extends Model>(klass: { new(): M }): M {
    return new klass();
  }


  getIdentity(model: Model): RecordIdentity {
    return undefined;
  }


  getAttributeValues<M extends Model>(model: M, getter?: Getter<M>): Dict<any> {
    return undefined;
  }

  setAttributeValues<M extends Model>(model: M, attributes: Dict<any>, setter?: Setter<M>): void {
    let registry = this.getRegistry();
    let reflection = this.getOrbitReflection(this.getHiddenOrbit(model).klass);

    for (let name in attributes) {
      if (attributes.hasOwnProperty(name)) {
        let attributeInfo: AttributeInfo = findAttributeInfoByName(reflection, name);

        let beforeSetAttr = {model, attributes, setter, name, attributeInfo };
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


  getHiddenOrbit(model: HiddenOrbitProp): HiddenOrbit {
    return undefined;
  }

  setHiddenOrbit(model: HiddenOrbitProp, value: HiddenOrbit): void {
  }


  getOrbitReflection(klass: { new(): any }): OrbitReflection {
    return undefined;
  }

  setOrbitReflection(klass: { new(): any }, reflection: OrbitReflection): void {
  }


  private getRegistry(): MiddlewareRegistry<HiddenOrbitProp, Model> {
    return this.di.get("middleware", "registry");
  }
}