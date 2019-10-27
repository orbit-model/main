import BranchQuery from "./BranchQuery";
import QueryBuilderZero from "./QueryBuilderZero";
import Memory from "@orbit/memory";
import Model from "./Model";

export default interface Branch {
  /**
   * get the current fork of the store
   */
  getMemorySource(): Memory;

  /**
   * create a sub branch of the current branch by forking the store
   */
  fork(): Promise<Branch>;

  /**
   * persist all the changes made since this `Branch` has been created
   */
  mergeAndDestroy(): Promise<void>;

  /**
   * clean up event handlers to allow garbage collection to work
   */
  abandon(): void;

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
