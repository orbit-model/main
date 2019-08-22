export default interface HasMany<T> {
  getAll(): Promise<T[]>;

  add(model: T): Promise<void>;

  remove(model: T): Promise<void>;

  sync(models: T[]): Promise<void>;

  replaceAll(models: T[]): Promise<void>;
}
