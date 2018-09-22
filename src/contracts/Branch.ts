import Store from '@orbit/store';
import { Evented } from '@orbit/core';
import Model from './Model';

export default interface Branch extends Evented {
  /**
   * get the current fork of the store
   */
  getStore(): Store;
  /**
   * create a sub branch of the current branch by forking the store
   */
  fork(): Branch;
  /**
   * roll back all the changes made to the current store
   */
  rollback(): Promise<void>;
  /**
   * merges the parent branch into this branch to get any updates made since the `fork()`
   */
  updateFromParent(): Promise<void>;
  /**
   * persist all the changes made since this `Branch` has been created
   */
  mergeAndDestroy(): Promise<void>;
  /**
   * (not sure if this method is necessary)
   * clean up stuff (like events), if the user doesn't want to merge the store
   */
  abandon(): void;

  /**
   * "captures" a model or fails to do so
   */
  capture(model: Model): void;
}

export interface RootBranch extends Evented {
  getStore: () => Store;
  fork: () => Branch;
}
