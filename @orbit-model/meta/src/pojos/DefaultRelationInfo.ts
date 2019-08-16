import { RelationInfo } from "../../../contracts";

export default class DefaultRelationInfo implements RelationInfo {
  public readonly attributeName: string;
  public readonly inverse: string | undefined;
  public readonly name: string;
  public readonly relatedName: string;
  public readonly type: "hasOne" | "hasMany";


  constructor(attributeName: string, name: string, relatedName: string, type: "hasOne" | "hasMany", inverse: string | undefined = undefined) {
    this.attributeName = attributeName;
    this.name = name;
    this.relatedName = relatedName;
    this.type = type;
    this.inverse = inverse;
  }
}
