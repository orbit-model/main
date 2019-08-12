import ModelInfo, { AttributeInfo, RelationInfo } from "@orbit-model/core/dist/ModelInfo";

export default class DefaultModelInfo implements ModelInfo {
  attributes: { [p: string]: AttributeInfo } = {};
  className: string | undefined;
  name: string | undefined;
  relationships: { [p: string]: RelationInfo } = {};
}
