export default interface Container {
  register(namespace: string, name: string, klass: { new(): any }, options?: { singleton: boolean }): void;

  registerObject(namespace: string, name: string, value: any): void;

  get<T>(namespace: string, name: string): T;

  getClass<T>(namespace: string, name: string): { new(): T };    // to access static methods

  getNames(namespace: string): string[];
}
