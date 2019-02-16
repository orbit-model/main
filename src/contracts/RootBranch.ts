import Store from '@orbit/store';
import Branch from "../branching/Branch";

export default interface RootBranch<MODEL> {
  getStore(): Store;
  fork(): Branch<MODEL>;
}
