import OperationProcessor from "./OperationProcessor";
import { Operation } from "@orbit/data";
import { UpdateRecordOperation } from "@orbit/records";
import DefaultBranch from "../DefaultBranch";
import { Middleware } from "@orbit-model/middleware";

export default class UpdateRecord implements OperationProcessor {
  getOpCodes(): string[] {
    return ["updateRecord"];
  }

  run(operation: Operation, branch: DefaultBranch): Promise<any> {
    let updateOp = operation as UpdateRecordOperation;
    let model = branch.getModelMap().get(updateOp.record);
    if (model !== undefined) {
      Middleware.updateModel(updateOp.record, model);
    }
    return Promise.resolve();
  }
}
