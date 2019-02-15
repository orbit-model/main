import Store from '@orbit/store';
import LiteBranch from "./LiteBranch";

export default interface RootBranch {
  getStore(): Store;
  fork(): LiteBranch;
}
