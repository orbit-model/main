import { Injectable } from "@orbit-model/di";
import { RecordSchema } from "@orbit/records";

export default interface SchemaBuilder extends Injectable {
  /**
   * creates a schema based on the models in the DI
   */
  createSchema(): RecordSchema;

  /**
   * Function used to pluralize names.
   */
  setPluralizer(f: (word: string) => string): void;

  /**
   * Function used to singularize names.
   */
  setSingularizer(f: (word: string) => string): void;
}
