import Injectable from "../contracts/Injectable";

export default interface RelationshipAdapter<MODEL /* extends Model */> extends Injectable {
  // hasOne relationship:
  getRelatedModel<T extends MODEL, R extends MODEL>(model: T, relationship: string): Promise<R>;

  setRelatedModel<T extends MODEL, R extends MODEL>(model: T, value: R, relationship?: string): Promise<void>;


  // hasMany relationship:
  getAllRelatedModels<T extends MODEL, R extends MODEL>(model: T, relationship: string): Promise<R[]>;

  addRelatedModel<T extends MODEL, R extends MODEL>(model: T, value: R, relationship?: string): Promise<void>;

  removeRelatedModel<T extends MODEL, R extends MODEL>(model: T, value: R, relationship?: string): Promise<void>;

  replaceRelatedModels<T extends MODEL, R extends MODEL>(model: T, value: R[], relationship?: string): Promise<void>;

  syncRelatedModels<T extends MODEL, R extends MODEL>(model: T, value: R[], relationship?: string): Promise<void>;
}
