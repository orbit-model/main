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

  // console.log(Reflect.getMetadataKeys(target, key));
  console.log(Reflect.getMetadata('design:type', target, key));

  return "string";
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
