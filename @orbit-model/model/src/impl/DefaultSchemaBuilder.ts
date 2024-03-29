import { SchemaBuilder } from "@orbit-model/contracts";
import { AttributeDefinition, ModelDefinition, RecordSchema, RelationshipDefinition } from "@orbit/records";
import { Dict } from "@orbit/utils";
import { Container } from "@orbit-model/di";
import { ModelMetaAccessor } from "@orbit-model/meta";
// this is a plain JS lib without TS support
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { pluralize, singularize } from "inflected";

export default class DefaultSchemaBuilder implements SchemaBuilder {
  private di: Container | null = null;
  private pluralize: (word: string) => string;
  private singularize: (word: string) => string;

  private static version = 1;

  constructor() {
    this.pluralize = pluralize;
    this.singularize = singularize;
  }

  _setOrbitDi(di: Container): void {
    this.di = di;
  }

  setPluralizer(f: (word: string) => string): void {
    this.pluralize = f;
  }

  setSingularizer(f: (word: string) => string): void {
    this.singularize = f;
  }

  createSchema(version?: number): RecordSchema {
    if (this.di === null) {
      throw new Error("the DefaultSchemaBuilder has to be instantiated through a DI container");
    }

    let models: Dict<ModelDefinition> = {};

    for (let diName of this.di.getNames("models")) {
      let klass = this.di.getClass("models", diName);
      let reflection = ModelMetaAccessor.getReflection(klass);
      if (reflection === undefined) {
        throw new Error(
          `Model '${diName}' with class name '${klass.name}' has not been initialized correctly: no reflection information found`
        );
      }

      let attributes: Dict<AttributeDefinition> = {};
      for (let attr in reflection.modelInfo.attributes) {
        let attrInfo = reflection.modelInfo.attributes[attr];
        attributes[attrInfo.name] = {
          type: attrInfo.schemaType,
        };
      }

      let relationships: Dict<RelationshipDefinition> = {};
      for (let rel in reflection.modelInfo.relationships) {
        if (Object.prototype.hasOwnProperty.call(reflection.modelInfo.relationships, rel)) {
          let relInfo = reflection.modelInfo.relationships[rel];
          let inverse = relInfo.inverse;
          if (!inverse) {
            if (relInfo.type === "hasMany") {
              inverse = diName;
            } else if (relInfo.type === "hasOne") {
              inverse = this.pluralize(diName);
            }
          }

          relationships[relInfo.name] = {
            kind: relInfo.type,
            model: relInfo.relatedName,
            inverse,
          };
        }
      }

      models[diName] = {
        keys: {
          remoteId: {},
        },
        attributes,
        relationships,
      };
    }

    return new RecordSchema({
      models,
      singularize: this.singularize,
      pluralize: this.pluralize,
      version: version || DefaultSchemaBuilder.version++,
    });
  }
}
