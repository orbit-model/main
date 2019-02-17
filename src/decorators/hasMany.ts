import { camelize } from "@orbit/utils";
import DefaultOrbitModelReflection from "../meta/pojos/DefaultOrbitModelReflection";
import DefaultModelInfo from "../meta/pojos/DefaultModelInfo";
import { RelationInfo } from "../meta/ModelInfo";
import DefaultRelationInfo from "../meta/pojos/DefaultRelationInfo";
import DefaultHasMany from "./impl/DefaultHasMany";
import ModelMetaAccessor from "../meta/ModelMetaAccessor";
import ApplicationDI from "../di/ApplicationDI";

interface RelationOptions {
  name?: string;
  relatedName?: string
  inverse?: string
}

export default function hasManyGenerator(options: RelationOptions = {}) {
  return function hasMany(target: any, key: string) {
    // 1. gather meta data
    let diName = options.name || camelize(key);

    let mma = ApplicationDI.getDI().get<ModelMetaAccessor>('system', 'modelMetaAccessor');
    let reflection = mma.getReflection(target);
    if (reflection === undefined) {
      reflection = new DefaultOrbitModelReflection(new DefaultModelInfo());
      mma.setReflection(target, reflection);
    }

    let relationInfo: RelationInfo = new DefaultRelationInfo();
    relationInfo.attributeName = key;
    relationInfo.name = diName;
    relationInfo.type = "hasMany";
    relationInfo.relatedName = options.relatedName || diName;

   reflection.modelInfo.relationships[key] = relationInfo;

    // 2. create function
    target[key] = function hasManyRelationship() {
      return new DefaultHasMany(relationInfo.relatedName, this)
    }
  }
}
