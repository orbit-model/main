import { Operation } from "@orbit/data";
import DefaultBranch from "../DefaultBranch";
import MemorySource from "@orbit/memory";

export default interface OperationProcessor {
  getOpCodes(): string[];
  run(operation: Operation, branch: DefaultBranch, source: MemorySource): Promise<any>;
}
