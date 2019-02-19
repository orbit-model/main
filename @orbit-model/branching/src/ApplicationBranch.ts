import Branch from "./Branch";
import DefaultBranch from "./impl/DefaultBranch";
import Store from "@orbit/store";
import { Model } from "@orbit-model/model";

export default class ApplicationBranch {

  private static store: Store;

  public static setup(store: Store): void {
    ApplicationBranch.store = store;
  }

  public static fork(): Branch<Model> {
    return new DefaultBranch(ApplicationBranch.store);
  }
}
