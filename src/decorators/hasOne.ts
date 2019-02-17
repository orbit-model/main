import { camelize } from "@orbit/utils";
import DefaultOrbitModelReflection from "../meta/pojos/DefaultOrbitModelReflection";
import DefaultModelInfo from "../meta/pojos/DefaultModelInfo";
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
