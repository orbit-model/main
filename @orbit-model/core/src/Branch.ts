import BranchQuery from "./BranchQuery";
import QueryBuilderZero from "./QueryBuilderZero";
import Memory from '@orbit/memory';


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
   * @param queryBuilder defaults to "QueryBuilder"
   */
  query<Q extends BranchQuery = QueryBuilderZero>(queryBuilder?: string): Q;
}
