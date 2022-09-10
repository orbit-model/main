import BranchQuery from "./BranchQuery";
import QueryBuilderZero from "./QueryBuilderZero";
import {MemorySource} from "@orbit/memory";
import Model from "./Model";

export default interface Branch {
  /**
   * get the current fork of the store
   */
  getMemorySource(): MemorySource;

  /**
   * create a sub branch of the current branch by forking the store
   */
  fork(): Promise<Branch>;

  /**
   * whether or not the Branch has already been marked as destroyed or abandoned
   */
  isActive(): boolean;

  /**
   * persist all the changes made since this `Branch` has been created
   */
  mergeAndDestroy(): Promise<void>;

  /**
   * clean up event handlers to allow garbage collection to work
   */
  abandon(): Promise<void>;

  /**
   * add a promise to the chain for this.settle()
   */
  _chain(promise: Promise<any>): void;

  /**
   * allow internal promises to settle before further processing occurs
   * e.g. after model edits
   */
  settle(): Promise<any>;

  /**
   * register model with branch for auto updating
   */
  registerModel<MODEL extends Model>(model: MODEL): void;

  /**
   * unregister model from auto updating (model has been deleted)
   */
  unregisterModel<MODEL extends Model>(model: MODEL): void;

  /**
   * @param queryBuilder defaults to "QueryBuilder"
   */
  query<Q extends BranchQuery = QueryBuilderZero>(queryBuilder?: string): Q;
}
