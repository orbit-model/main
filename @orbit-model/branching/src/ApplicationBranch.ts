import Store from "@orbit/store";
import Model from "../model/Model";
import Branch from "./Branch";
import DefaultBranch from "./impl/DefaultBranch";

export default class ApplicationBranch {

  private static store: Store;

  public static setup(store: Store): void {
    ApplicationBranch.store = store;
  }

  public static fork(): Branch<Model> {
    return new DefaultBranch(ApplicationBranch.store);
  }
}
