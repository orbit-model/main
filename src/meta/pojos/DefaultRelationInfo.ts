import { RelationInfo } from "../../contracts/ModelInfo";

export default class DefaultRelationInfo implements RelationInfo {
  attributeName: string;
  inverse: string;
  name: string;
  relatedName: string;
  type: "hasOne" | "hasMany";
}
