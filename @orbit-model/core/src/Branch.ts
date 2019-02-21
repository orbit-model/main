import BranchQuery from "./BranchQuery";
import QueryBuilderZero from "./QueryBuilderZero";
import Store from '@orbit/store';


export default interface Branch {
  /**
   * get the current fork of the store
   */
  getStore(): Store;

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
   * @param queryBuilder = "query-builder"
   */
  query<Q extends BranchQuery = QueryBuilderZero>(queryBuilder?: string): Q;
}
