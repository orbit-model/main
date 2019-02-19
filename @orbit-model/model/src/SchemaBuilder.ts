import { Injectable } from '@orbit-model/di';
import { Schema } from '@orbit/data';

export default interface SchemaBuilder extends Injectable {

  /**
   * creates a schema based on the models in the DI
   */
  createSchema(): Schema;

  /**
   * Function used to pluralize names.
   */
  setPluralizer(f: (word: string) => string): void;

  /**
   * Function used to singularize names.
   */
  setSingularizer(f: (word: string) => string): void;
}
