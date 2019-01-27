import { dasherize } from "@orbit/utils";
import ModelMetaAccessors from "../meta/ModelMetaAccessors";
import DefaultOrbitModelReflection from "../meta/pojos/DefaultOrbitModelReflection";
import DefaultModelInfo from "../meta/pojos/DefaultModelInfo";
import { AttributeInfo } from "../contracts/ModelInfo";
import DefaultAttributeInfo from "../meta/pojos/DefaultAttributeInfo";
import "reflect-metadata";

interface AttrOptions {
  name?: string;
  transform?: string;
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
  return function attr(target: any, key: string) {
    let diName = options.name || dasherize(key);

    if (typeof ModelMetaAccessors.getReflection(target) === "undefined") {
      ModelMetaAccessors.setReflection(target, new DefaultOrbitModelReflection(new DefaultModelInfo()));
    }

    let attrInfo: AttributeInfo = new DefaultAttributeInfo();
    attrInfo.attributeName = key;
    attrInfo.name = diName;
    attrInfo.defaultValue = options.defaultValue;
    attrInfo.transform = options.transform;
    attrInfo.schemaType = options.schemaType || getSchemaType(target, key);

    ModelMetaAccessors.getReflection(target).modelInfo.attributes[key] = attrInfo;
  }
}
