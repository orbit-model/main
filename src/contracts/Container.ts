export default interface Container {

  /**
   * This is the standard register method. Here a class is bound to the give `namespace` and `name` strings.
   *
   * @param namespace
   * @param name
   * @param klass
   * @param options
   */
  register(namespace: string, name: string, klass: { new(): any }, options?: { singleton: boolean }): void;

  /**
   * This method allows you to register an instance (or rather any value) instead of a class.
   *
   * @param namespace
   * @param name
   * @param value
   */
  registerObject(namespace: string, name: string, value: any): void;

  /**
   * Returns an instance or throws an error if nothing is registered for given `namespace` and `name` parameters.
   *
   * This is the point where actual instances get created and the `Container` will be injected into the class,
   *  in case it implements the `Injectable` interface.
   *
   * @param namespace
   * @param name
   */
  get<T>(namespace: string, name: string): T;

  /**
   * Returns a class or throws an error if no class was registered for given `namespace` and `name` parameters.
   *
   * The primary purpose of this method is, to allow user code to easily access static methods and properties on a class.
   *
   * @param namespace
   * @param name
   */
  getClass<T>(namespace: string, name: string): { new(): T };

  /**
   * Returns an array of all `name` in the given `namespace`.
   *
   * This is used for example to iterate over the registered models to create an orbit schema.
   *
   * @param namespace
   */
  getNames(namespace: string): string[];
}
