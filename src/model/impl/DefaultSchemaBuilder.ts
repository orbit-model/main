import SchemaBuilder from "../SchemaBuilder";
import Container from "../../di/Container";
import { ModelDefinition, Schema } from "@orbit/data";
import { Dict } from "@orbit/utils";
import ModelMetaAccessor from "../../meta/ModelMetaAccessor";

export default class DefaultSchemaBuilder implements SchemaBuilder {
  private di: Container;
  private pluralize: (word: string) => string;
  private singularize: (word: string) => string;

  private static version = 1;

  _setOrbitDi(di: Container): void {
    this.di = di;

    this.pluralize = Schema.prototype.pluralize;
    this.singularize = Schema.prototype.singularize;
  }

  setPluralizer(f: (word: string) => string): void {
    this.pluralize = f;
  }

  setSingularizer(f: (word: string) => string): void {
    this.singularize = f;
  }

  createSchema(): Schema {
    let mma: ModelMetaAccessor = this.di.get('system', 'modelMetaAccessor');
    let models: Dict<ModelDefinition> = {};

    for (let diName of this.di.getNames('models')) {
      let klass = this.di.getClass('models', diName);
      let reflection = mma.getReflection(klass);

      let attributes = {};
      for (let attr in reflection.modelInfo.attributes) {
        let attrInfo = reflection.modelInfo.attributes[attr];
        attributes[attrInfo.name] = {
          type: attrInfo.schemaType
        };
      }

      let relationships = {};
      for (let rel in reflection.modelInfo.relationships) {
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
          type: relInfo.type,
          model: relInfo.relatedName,
          inverse
        };
      }

      models[diName] = {
        keys: {
          remoteId: {}
        },
        attributes,
        relationships,
      };
    }

    return new Schema({
      models,
      singularize: this.singularize,
      pluralize: this.pluralize,
      version: DefaultSchemaBuilder.version++
    });
  }

}
