export interface ModelInfo {
  className: string | undefined;  // todo: do we need this?
  name: string | undefined;    // effectively the JSON-API type of that model
  attributes: {
    [attributeName: string]: AttributeInfo
  },
  relationships: {
    [relationshipName: string]: RelationInfo
  }
}

export interface AttributeInfo {
  attributeName: string;    // actual name of the attribute on the model
  name: string;    // name for the API
  schemaType: string;
  defaultValue: number | string | boolean | undefined;
}

export interface RelationInfo {
  readonly attributeName: string;
  readonly name: string;
  readonly type: "hasOne" | "hasMany";
  readonly relatedName: string;    // name in the API == name of the class in the DI
  readonly inverse: string | undefined;
}
