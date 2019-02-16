import Store from '@orbit/store';
import LiteBranch from "./LiteBranch";

export default interface RootBranch<MODEL> {
  getStore(): Store;
  fork(): LiteBranch<MODEL>;
}
