import Store from '@orbit/store';

export default interface LiteBranch {
  /**
   * get the current fork of the store
   */
  getStore(): Store;
  /**
   * create a sub branch of the current branch by forking the store
   */
  fork(): LiteBranch;
  /**
   * persist all the changes made since this `Branch` has been created
   */
  mergeAndDestroy(): Promise<void>;
  /**
   * clean up event handlers in order to allow garbage collection
   */
  abandon(): void;
}
