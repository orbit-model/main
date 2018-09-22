import Model from './Model';

export default interface RelationshipAdapter {
  // hasOne relationship:
  getRelatedModel<T extends Model, R extends Model>(model: T, relationship: string): Promise<R>;

  setRelatedModel<T extends Model, R extends Model>(model: T, value: R, relationship?: string): Promise<void>;


  // hasMany relationship:
  getAllRelatedModels<T extends Model, R extends Model>(model: T, relationship: string): Promise<R[]>;

  addRelatedModel<T extends Model, R extends Model>(model: T, value: R, relationship?: string): Promise<void>;

  removeRelatedModel<T extends Model, R extends Model>(model: T, value: R, relationship?: string): Promise<void>;

  replaceRelatedModels<T extends Model, R extends Model>(model: T, value: R[], relationship?: string): Promise<void>;

  syncRelatedModels<T extends Model, R extends Model>(model: T, value: R[], relationship?: string): Promise<void>;
}
