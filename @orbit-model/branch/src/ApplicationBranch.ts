import DefaultBranch from "./impl/DefaultBranch";
import { MemorySource } from "@orbit/memory";
import { Branch } from "@orbit-model/contracts";

export default class ApplicationBranch {
  private static memorySource: MemorySource;

  public static setup(memorySource: MemorySource): void {
    ApplicationBranch.memorySource = memorySource;
  }

  public static fork(): Promise<Branch> {
    return DefaultBranch.factory(null, ApplicationBranch.memorySource);
  }
}
