import {MemorySource} from "@orbit/memory";
import Branch from "./Branch";

export default interface RootBranch {

  getMemorySource(): MemorySource;

  fork(): Promise<Branch>
}
