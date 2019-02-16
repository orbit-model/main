import { camelize } from "@orbit/utils";
import ModelMetaAccessors from "../meta/ModelMetaAccessors";
import DefaultOrbitModelReflection from "../meta/pojos/DefaultOrbitModelReflection";
import DefaultModelInfo from "../meta/pojos/DefaultModelInfo";
import { RelationInfo } from "../contracts/ModelInfo";
import DefaultRelationInfo from "../meta/pojos/DefaultRelationInfo";
import DefaultHasOne from "./impl/DefaultHasOne";

interface RelationOptions {
  name?: string;
  relatedName?: string
  inverse?: string
}

export default function hasOneGenerator(options: RelationOptions = {}) {
  return function hasOne(target: any, key: string) {
    // 1. gather meta data
    let diName = options.name || camelize(key);

    if (typeof ModelMetaAccessors.getReflection(target) === "undefined") {
      ModelMetaAccessors.setReflection(target, new DefaultOrbitModelReflection(new DefaultModelInfo()));
    }

    let relationInfo: RelationInfo = new DefaultRelationInfo();
    relationInfo.attributeName = key;
    relationInfo.name = diName;
    relationInfo.type = "hasOne";
    relationInfo.relatedName = options.relatedName || diName;

    ModelMetaAccessors.getReflection(target).modelInfo.relationships[key] = relationInfo;

    // 2. create function
    target[key] = function hasOneRelationship() {
      return new DefaultHasOne(relationInfo.relatedName, this)
    }
  }
}
