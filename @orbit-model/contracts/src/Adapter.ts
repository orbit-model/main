import Branch from "./Branch";
import Model from "./Model";
import { Record } from "@orbit/data";
import { Injectable } from "@orbit-model/di";

export default interface Adapter extends Injectable {
  /**
   * create a new model instance on the given branch
   */
  create<M extends Model>(modelName: string | Function | { new (): M }, branch: Branch, options?: { args?: any[] }): M;

  /**
   * create a new model instance on the given branch and set the data form the record
   */
  createFromRecord<M extends Model>(record: Record, branch: Branch, options?: { args?: any[] }): M;

  /**
   * update the (cached) data of a model
   */
  updateModel<M extends Model>(record: Record, model: M): void;

  /**
   * sets an individual value on a model and propagates it to the memory source
   */
  setAttrValue<M extends Model>(model: M, attribute: string, value: any): Promise<void>;

  /**
   * saves all values on a model to the store
   */
  save<M extends Model>(model: M): Promise<void>;

  /**
   * marks a given model as ready for deletion from the server (if the branch is ever merged)
   */
  destroy<M extends Model>(model: M): Promise<void>;
}
