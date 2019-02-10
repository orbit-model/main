import { AttributeInfo } from "../../contracts/ModelInfo";

export default class DefaultAttributeInfo implements AttributeInfo {
  attributeName: string;
  defaultValue: number | string | boolean;
  name: string;
  schemaType: string;
}
