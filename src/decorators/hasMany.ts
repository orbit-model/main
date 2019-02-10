import { dasherize } from "@orbit/utils";
import ModelMetaAccessors from "../meta/ModelMetaAccessors";
import DefaultOrbitModelReflection from "../meta/pojos/DefaultOrbitModelReflection";
import DefaultModelInfo from "../meta/pojos/DefaultModelInfo";
import { RelationInfo } from "../contracts/ModelInfo";
import DefaultRelationInfo from "../meta/pojos/DefaultRelationInfo";
import DefaultHasMany from "./impl/DefaultHasMany";

interface RelationOptions {
  name?: string;
  relatedName?: string
  inverse?: string
}

export default function hasManyGenerator(options: RelationOptions = {}) {
  return function hasMany(target: any, key: string) {
    // 1. gather meta data
    let diName = options.name || dasherize(key);

    if (typeof ModelMetaAccessors.getReflection(target) === "undefined") {
      ModelMetaAccessors.setReflection(target, new DefaultOrbitModelReflection(new DefaultModelInfo()));
    }

    let relationInfo: RelationInfo = new DefaultRelationInfo();
    relationInfo.attributeName = key;
    relationInfo.name = diName;
    relationInfo.type = "hasMany";
    relationInfo.relatedName = options.relatedName || diName;

    ModelMetaAccessors.getReflection(target).modelInfo.relationships[key] = relationInfo;

    // 2. create function
    target[key] = function hasManyRelationship() {
      return new DefaultHasMany(relationInfo.relatedName, this)
    }
  }
}
