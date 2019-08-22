import { AttributeInfo } from "@orbit-model/contracts";

export default class DefaultAttributeInfo implements AttributeInfo {
  attributeName: string;
  defaultValue: number | string | boolean | undefined;
  name: string;
  schemaType: string;

  constructor(
    attributeName: string,
    name: string,
    defaultValue: number | string | boolean | undefined,
    schemaType: string
  ) {
    this.attributeName = attributeName;
    this.defaultValue = defaultValue;
    this.name = name;
    this.schemaType = schemaType;
  }
}
