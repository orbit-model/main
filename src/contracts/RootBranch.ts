import Store from '@orbit/store';
import Branch from "./Branch";

export default interface RootBranch<MODEL> {
  getStore(): Store;
  fork(): Branch<MODEL>;
}
