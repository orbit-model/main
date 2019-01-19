
export default interface ModelInfo {
  className: string;  // todo: do we need this?
  name: string;    // effectively the JSON-API type of that model
  attributes?: {
    [attributeName: string]: AttributeInfo
  },
  relationships?: {
    [relationshipName: string]: RelationInfo
  }
}

export interface AttributeInfo {
  attributeName: string;    // actual name of the attribute on the model
  name: string;    // name for the API
  schemaType: string;
  defaultValue: number | string | boolean;
  transform: string;    // see https://github.com/orbitjs/orbit/issues/530
}

export interface RelationInfo {
  attributeName: string;
  name: string;
  type: "hasOne" | "hasMany";
  relatedName: string;    // name in the API == name of the class in the DI
  inverse: string
}
