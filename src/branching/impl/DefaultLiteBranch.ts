import LiteBranch from "../../contracts/LiteBranch";
import Store from "@orbit/store";

export default class DefaultLiteBranch implements LiteBranch {

  private readonly store: Store;
  private readonly parent: Store;

  constructor(store: Store, parent: Store) {
    this.store = store;
    this.parent = parent;
  }


  getStore(): Store {
    return this.store;
  }

  fork(): LiteBranch {
    return new DefaultLiteBranch(this.store.fork(), this.store);
  }

  mergeAndDestroy(): Promise<void> {
    return this.parent.merge(this.store);
  }

  updateFromParent(): Promise<void> {
    return this.store.merge(this.parent);
  }
}
