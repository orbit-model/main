import { camelize } from "@orbit/utils";
import { Adapter } from "../../contracts";
import {
  ModelMetaAccessor,
  DefaultOrbitModelReflection,
  DefaultModelInfo,
  DefaultAttributeInfo
} from "@orbit-model/meta";
import "reflect-metadata";
import { DI } from "@orbit-model/di";

interface AttrOptions {
  name?: string;
  schemaType?: string;
  defaultValue?: boolean | string | number;
}

function getSchemaType(target: any, key: string): string {
  let meta = Reflect.getMetadata("design:type", target, key);
  if (typeof meta !== "function") {
    throw new Error(
      `Was not able to get the reflection metadata of the property ${key} in class ${target.name}, please set the schema type parameter for this property`
    );
  }

  switch (meta.name) {
    case "String":
      return "string";
    case "Number":
      return "number";
    case "Boolean":
      return "boolean";
    default:
      throw new Error(`You have to define the schema type parameter for the property ${key} in class ${target.name}`);
  }
}

export default function attrGenerator(options: AttrOptions = {}) {
  return function attr(target: any, key: string): void {
    let diName = options.name || camelize(key);

    let reflection = ModelMetaAccessor.getReflection(target.constructor);
    if (reflection === undefined) {
      reflection = new DefaultOrbitModelReflection(new DefaultModelInfo());
      ModelMetaAccessor.setReflection(target.constructor, reflection);
    }

    let attrInfo = new DefaultAttributeInfo(
      key,
      diName,
      options.defaultValue,
      options.schemaType || getSchemaType(target, key)
    );
    reflection.modelInfo.attributes[key] = attrInfo;

    Object.defineProperty(target, key, {
      get(): any {
        let meta = ModelMetaAccessor.getMeta(this);
        return meta.values[attrInfo.name];
      },
      set(v: any): void {
        let adapter = DI.get<Adapter>("system", "Adapter");
        adapter.setAttrValue(this, key, v);
      }
    });
  };
}
