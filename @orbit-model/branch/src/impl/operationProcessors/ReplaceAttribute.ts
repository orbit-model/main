import OperationProcessor from "./OperationProcessor";
import { Operation } from "@orbit/data";
import { ReplaceAttributeOperation } from "@orbit/records";
import DefaultBranch from "../DefaultBranch";
import { ModelMetaAccessor } from "@orbit-model/meta";
import { AttributeInfo, Model } from "@orbit-model/contracts";

export default class ReplaceAttribute implements OperationProcessor {
  getOpCodes(): string[] {
    return ["replaceAttribute"];
  }

  run(operation: Operation, branch: DefaultBranch): Promise<any> {
    let replaceAttrOp = operation as ReplaceAttributeOperation;
    let model = branch.getModelMap().get(replaceAttrOp.record);
    if (model !== undefined) {
      let attrInfo = this.findAttribute(model, replaceAttrOp.attribute);
      if (attrInfo !== null) {
        let meta = ModelMetaAccessor.getMeta(model);
        meta.values[attrInfo.attributeName] = replaceAttrOp.value;
      }
    }
    return Promise.resolve();
  }

  private findAttribute(model: Model, orbitAttr: string): null | AttributeInfo {
    let reflection = ModelMetaAccessor.getReflection(model.constructor);
    if (!reflection) {
      throw new Error("Model registered with Branch does not have reflection data");
    }
    let attrs = reflection.modelInfo.attributes;
    for (let attribute in attrs) {
      if (Object.prototype.hasOwnProperty.apply(attrs, [attribute])) {
        if (attrs[attribute].name === orbitAttr) {
          return attrs[attribute];
        }
      }
    }
    return null;
  }
}
