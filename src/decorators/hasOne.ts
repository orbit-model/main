import { camelize } from "@orbit/utils";
import DefaultOrbitModelReflection from "../meta/pojos/DefaultOrbitModelReflection";
import DefaultModelInfo from "../meta/pojos/DefaultModelInfo";
import { RelationInfo } from "../meta/ModelInfo";
import DefaultRelationInfo from "../meta/pojos/DefaultRelationInfo";
import DefaultHasOne from "./impl/DefaultHasOne";
import ModelMetaAccessor from "../meta/ModelMetaAccessor";
import ApplicationDI from "../di/ApplicationDI";

interface RelationOptions {
  name?: string;
  relatedName?: string
  inverse?: string
}

export default function hasOneGenerator(options: RelationOptions = {}) {
  return function hasOne(target: any, key: string) {
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
    relationInfo.type = "hasOne";
    relationInfo.relatedName = options.relatedName || diName;

    reflection.modelInfo.relationships[key] = relationInfo;

    // 2. create function
    target[key] = function hasOneRelationship() {
      return new DefaultHasOne(relationInfo.relatedName, this)
    }
  }
}
