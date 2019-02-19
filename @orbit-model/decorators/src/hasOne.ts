import { camelize } from "@orbit/utils";
import DefaultHasOne from "./impl/DefaultHasOne";
import ApplicationDI from "@orbit-model/di";
import {
  ModelMetaAccessor,
  DefaultOrbitModelReflection,
  DefaultModelInfo,
  DefaultRelationInfo
} from "@orbit-model/meta";
import { Adapter } from "@orbit-model/middleware";
import { Model } from "@orbit-model/model";

interface RelationOptions {
  name?: string;
  relatedName?: string
  inverse?: string
}

export default function hasOneGenerator(options: RelationOptions = {}) {
  return function hasOne(target: any, attributeName: string) {
    // 1. gather meta data
    let diName = options.name || camelize(attributeName);

    let mma = ApplicationDI.getDI().get<ModelMetaAccessor>('system', 'modelMetaAccessor');
    let reflection = mma.getReflection(target);
    if (reflection === undefined) {
      reflection = new DefaultOrbitModelReflection(new DefaultModelInfo());
      mma.setReflection(target, reflection);
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
