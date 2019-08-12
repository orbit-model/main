import { camelize } from "@orbit/utils";
import DefaultHasOne from "./impl/DefaultHasOne";
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

export default function hasOneGenerator(options: RelationOptions = {}) {
  return function hasOne(target: any, attributeName: string) {
    // 1. gather meta data
    let diName = options.name || camelize(attributeName);

    let reflection = ModelMetaAccessor.getReflection(target.constructor);
    if (reflection === undefined) {
      reflection = new DefaultOrbitModelReflection(new DefaultModelInfo());
      ModelMetaAccessor.setReflection(target.constructor, reflection);
    }

    let relationInfo = new DefaultRelationInfo(attributeName, diName, options.relatedName||diName, "hasOne");
    relationInfo.inverse = options.inverse;
    reflection.modelInfo.relationships[attributeName] = relationInfo;

    // 2. create function
    target[attributeName] = function hasOneRelationship() {
      return new DefaultHasOne(relationInfo.relatedName, this)
    }
  }
};
