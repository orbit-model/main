import { RelationInfo } from "../ModelInfo";

export default class DefaultRelationInfo implements RelationInfo {
  attributeName: string;
  inverse: string| undefined;
  name: string;
  relatedName: string;
  type: "hasOne" | "hasMany";


  constructor(attributeName: string, name: string, relatedName: string, type: "hasOne" | "hasMany") {
    this.attributeName = attributeName;
    this.name = name;
    this.relatedName = relatedName;
    this.type = type;
  }
}
