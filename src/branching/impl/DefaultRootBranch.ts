import RootBranchContract from "../../contracts/RootBranch";
import Store from "@orbit/store";
import LiteBranch from "../../contracts/LiteBranch";
import DefaultLiteBranch from "./DefaultLiteBranch";
import Model from "../../contracts/Model";

export default class DefaultRootBranch implements RootBranchContract<Model> {

  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }


  getStore(): Store {
    return this.store;
  }

  fork(): LiteBranch<Model> {
    return new DefaultLiteBranch(this.store);
  }

}
