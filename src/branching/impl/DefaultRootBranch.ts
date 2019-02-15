import RootBranchContract from "../../contracts/RootBranch";
import Store from "@orbit/store";
import LiteBranch from "../../contracts/LiteBranch";
import DefaultLiteBranch from "./DefaultLiteBranch";

export default class DefaultRootBranch implements RootBranchContract {

  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }


  getStore(): Store {
    return this.store;
  }

  fork(): LiteBranch {
    return new DefaultLiteBranch(this.store);
  }

}
