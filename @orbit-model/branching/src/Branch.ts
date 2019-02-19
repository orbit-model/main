import Store from '@orbit/store';
import { BranchQuery, QueryBuilderZero } from "@orbit-model/query";

export default interface Branch<MODEL> {
  /**
   * get the current fork of the store
   */
  getStore(): Store;

  /**
   * create a sub branch of the current branch by forking the store
   */
  fork(): Branch<MODEL>;

  /**
   * persist all the changes made since this `Branch` has been created
   */
  mergeAndDestroy(): Promise<void>;

  /**
   * clean up event handlers to allow garbage collection to work
   */
  abandon(): void;

  /**
   * @param queryBuilder = "query-builder"
   */
  query<Q extends BranchQuery<MODEL> = QueryBuilderZero<MODEL>>(queryBuilder?: string): Q;
}