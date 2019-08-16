import { camelize } from "@orbit/utils";
import DefaultHasMany from "./impl/DefaultHasMany";
import {
  DefaultModelInfo,
  DefaultOrbitModelReflection,
  DefaultRelationInfo,
  ModelMetaAccessor
} from "@orbit-model/meta";
// @ts-ignore
import { singularize } from 'inflected';

interface RelationOptions {
  name?: string;  // name of the relatationship
  relatedName?: string  // name of the related model
  inverse?: string  // name of the inverse model
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

    let relatedName = options.relatedName || singularize(diName);
    let relationInfo = new DefaultRelationInfo(attributeName, diName, relatedName, "hasMany", options.inverse);
    reflection.modelInfo.relationships[attributeName] = relationInfo;

    // 2. create function
    target[attributeName] = function hasManyRelationship() {
      return new DefaultHasMany(diName, this)
    }
  }
}
