export default interface HasOne<T> {
  get(): Promise<T>;

  set(model: T): Promise<void>;
}
