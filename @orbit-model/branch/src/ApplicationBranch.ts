import DefaultBranch from "./impl/DefaultBranch";
import Store from "@orbit/store";
import { Branch } from "@orbit-model/core";

export default class ApplicationBranch {

  private static store: Store;

  public static setup(store: Store): void {
    ApplicationBranch.store = store;
  }

  public static fork(): Promise<Branch> {
    return DefaultBranch.factory(ApplicationBranch.store);
  }
}
