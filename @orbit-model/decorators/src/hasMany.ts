import { camelize } from "@orbit/utils";
import DefaultHasMany from "./impl/DefaultHasMany";
import {
  DefaultModelInfo,
  DefaultOrbitModelReflection,
  DefaultRelationInfo,
  ModelMetaAccessor,
} from "@orbit-model/meta";
// this is a plain JS lib without TS support
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { singularize } from "inflected";
import HasMany from "./contracts/HasMany";

interface RelationOptions {
  name?: string; // name of the relatationship
  relatedName?: string; // name of the related model
  inverse?: string; // name of the inverse model
}

export default function hasManyGenerator(options: RelationOptions = {}) {
  return function hasMany(target: any, attributeName: string): void {
    // 1. gather meta data
    let diName = options.name || camelize(attributeName);

    let reflection = ModelMetaAccessor.getReflection(target.constructor);
    if (reflection === undefined) {
      reflection = new DefaultOrbitModelReflection(new DefaultModelInfo());
      ModelMetaAccessor.setReflection(target.constructor, reflection);
    }

    let relatedName = options.relatedName || singularize(diName);
    reflection.modelInfo.relationships[attributeName] = new DefaultRelationInfo(
      attributeName,
      diName,
      relatedName,
      "hasMany",
      options.inverse
    );

    // 2. create function
    target[attributeName] = function hasManyRelationship(): HasMany<any> {
      return new DefaultHasMany(diName, this);
    };
  };
}
