import DefaultBranch from "./impl/DefaultBranch";
import Memory from "@orbit/memory";
import { Branch } from "@orbit-model/core";

export default class ApplicationBranch {

  private static store: Memory;

  public static setup(store: Memory): void {
    ApplicationBranch.store = store;
  }

  public static fork(): Promise<Branch> {
    return DefaultBranch.factory(ApplicationBranch.store);
  }
}
