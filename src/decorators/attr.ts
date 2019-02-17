import { camelize } from "@orbit/utils";
import DefaultOrbitModelReflection from "../meta/pojos/DefaultOrbitModelReflection";
import DefaultModelInfo from "../meta/pojos/DefaultModelInfo";
import { AttributeInfo } from "../meta/ModelInfo";
import DefaultAttributeInfo from "../meta/pojos/DefaultAttributeInfo";
import "reflect-metadata";
import Model from "../model/Model";
import ApplicationDI from "../di/ApplicationDI";
import Adapter from "../middleware/Adapter";
import { Record } from '@orbit/data';
import ModelMetaAccessor from "../meta/ModelMetaAccessor";

interface AttrOptions {
  name?: string;
  schemaType?: string;
  defaultValue?: boolean | string | number;
}

function getSchemaType(target: any, key: string): string {
  let meta = Reflect.getMetadata('design:type', target, key);
  if (typeof meta !== "function") {
    throw new Error(`Was not able to get the reflection metadata of the property ${key} in class ${target.name}, please set the schema type parameter for this property`);
  }

  switch (meta.name) {
    case "String":
      return "string";
    case "Number":
      return "number";
    case "Boolean":
      return "boolean";
    default:
      throw new Error(`You have to define the schema type parameter for the property ${key} in class ${target.name}`)
  }
}

export default function attrGenerator(options: AttrOptions = {}) {
  return function attr<M extends Model>(target: { new(): M }, key: string) {
    let diName = options.name || camelize(key);

    let mma = ApplicationDI.getDI().get<ModelMetaAccessor>('system', 'modelMetaAccessor');
    let reflection = mma.getReflection(target);
    if (reflection === undefined) {
      reflection = new DefaultOrbitModelReflection(new DefaultModelInfo());
      mma.setReflection(target, reflection);
    }

    let attrInfo: AttributeInfo = new DefaultAttributeInfo();
    attrInfo.attributeName = key;
    attrInfo.name = diName;
    attrInfo.defaultValue = options.defaultValue;
    attrInfo.schemaType = options.schemaType || getSchemaType(target, key);

    reflection.modelInfo.attributes[key] = attrInfo;

    Object.defineProperty(target, key, {
      get(): any {
        return mma.getMeta(this).values[attrInfo.name];
      },
      set(v: any): void {
        let adapter: Adapter<Record, Model> = ApplicationDI.getDI().get('middleware', 'adapter');
        adapter.setAttrValue(this, key, v);
      }
    })
  }
}
