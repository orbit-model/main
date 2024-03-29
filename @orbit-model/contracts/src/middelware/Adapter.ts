import Branch from "../Branch";
import Model from "../Model";
import { InitializedRecord } from "@orbit/records";
import { Injectable } from "@orbit-model/di";
import ModelClass from "../ModelClass";

export default interface Adapter extends Injectable {
  /**
   * create a new model instance on the given branch
   */
  create<M extends Model>(modelName: string | Function | ModelClass<M>, branch: Branch, options?: { args?: any[] }): M;

  /**
   * create a new model instance on the given branch and set the data form the record
   */
  createFromRecord<M extends Model>(record: InitializedRecord, branch: Branch, options?: { args?: any[] }): M;

  /**
   * update the (cached) data of a model
   */
  updateModel<M extends Model>(record: InitializedRecord, model: M): void;

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
