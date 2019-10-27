import DefaultBranch from "./impl/DefaultBranch";
import Memory from "@orbit/memory";
import { Branch } from "@orbit-model/contracts";

export default class ApplicationBranch {
  private static memorySource: Memory;

  public static setup(memorySource: Memory): void {
    ApplicationBranch.memorySource = memorySource;
  }

  public static fork(): Promise<Branch> {
    return DefaultBranch.factory(null, ApplicationBranch.memorySource);
  }
}
