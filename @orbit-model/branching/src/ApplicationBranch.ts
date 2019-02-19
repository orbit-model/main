import Branch from "./Branch";
import DefaultBranch from "./impl/DefaultBranch";
import Store from "@orbit/store";

export default class ApplicationBranch {

  private static store: Store;

  public static setup(store: Store): void {
    ApplicationBranch.store = store;
  }

  public static fork(): Branch {
    return new DefaultBranch(ApplicationBranch.store);
  }
}
