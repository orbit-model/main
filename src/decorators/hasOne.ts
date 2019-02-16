import { camelize } from "@orbit/utils";
import DefaultOrbitModelReflection from "../meta/pojos/DefaultOrbitModelReflection";
import DefaultModelInfo from "../meta/pojos/DefaultModelInfo";
import { RelationInfo } from "../contracts/ModelInfo";
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

    let mma: ModelMetaAccessor = ApplicationDI.getDI().get('system', 'modelMetaAccessor');
    if (typeof mma.getReflection(target) === "undefined") {
      mma.setReflection(target, new DefaultOrbitModelReflection(new DefaultModelInfo()));
    }

    let relationInfo: RelationInfo = new DefaultRelationInfo();
    relationInfo.attributeName = key;
    relationInfo.name = diName;
    relationInfo.type = "hasOne";
    relationInfo.relatedName = options.relatedName || diName;

    mma.getReflection(target).modelInfo.relationships[key] = relationInfo;

    // 2. create function
    target[key] = function hasOneRelationship() {
      return new DefaultHasOne(relationInfo.relatedName, this)
    }
  }
}
