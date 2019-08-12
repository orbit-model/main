import { camelize } from "@orbit/utils";
import DefaultHasMany from "./impl/DefaultHasMany";
import {
  ModelMetaAccessor,
  DefaultOrbitModelReflection,
  DefaultModelInfo,
  DefaultRelationInfo
} from "@orbit-model/meta";
import { DI } from "@orbit-model/di";

interface RelationOptions {
  name?: string;
  relatedName?: string
  inverse?: string
}

export default function hasManyGenerator(options: RelationOptions = {}) {
  return function hasMany(target: any, attributeName: string) {
    // 1. gather meta data
    let diName = options.name || camelize(attributeName);

    let reflection = ModelMetaAccessor.getReflection(target.constructor);
    if (reflection === undefined) {
      reflection = new DefaultOrbitModelReflection(new DefaultModelInfo());
      ModelMetaAccessor.setReflection(target.constructor, reflection);
    }

    let relationInfo = new DefaultRelationInfo(attributeName, diName, options.relatedName || diName, "hasMany");
    relationInfo.inverse = options.inverse;
    reflection.modelInfo.relationships[attributeName] = relationInfo;

    // 2. create function
    target[attributeName] = function hasManyRelationship() {
      return new DefaultHasMany(relationInfo.relatedName, this)
    }
  }
}
