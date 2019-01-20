import ModelInfo, { AttributeInfo, RelationInfo } from "../../contracts/ModelInfo";

export default class DefaultModelInfo implements ModelInfo {
  attributes: { [p: string]: AttributeInfo } = {};
  className: string;
  name: string;
  relationships: { [p: string]: RelationInfo } = {};
}
