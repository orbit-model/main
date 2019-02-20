import { camelize } from "@orbit/utils";
import DefaultHasMany from "./impl/DefaultHasMany";
import { Model } from "@orbit-model/core";
import ApplicationDI from "@orbit-model/di";
import {
  ModelMetaAccessor,
  DefaultOrbitModelReflection,
  DefaultModelInfo,
  DefaultRelationInfo
} from "@orbit-model/meta";

interface RelationOptions {
  name?: string;
  relatedName?: string
  inverse?: string
}

export default function hasManyGenerator(options: RelationOptions = {}) {
  return function hasMany(target: any, attributeName: string) {
    // 1. gather meta data
    let diName = options.name || camelize(attributeName);

    let mma = ApplicationDI.getDI().get<ModelMetaAccessor>('system', 'modelMetaAccessor');
    let reflection = mma.getReflection(target);
    if (reflection === undefined) {
      reflection = new DefaultOrbitModelReflection(new DefaultModelInfo());
      mma.setReflection(target, reflection);
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
