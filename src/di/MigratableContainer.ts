import Container from "../contracts/Container";

export default interface MigratableContainer extends Container {

  /**
   * The only valid use case for this method is, when migrating from another container.
   *
   * This method will only be called for klasses registered with the singleton option AND in case the class has been
   * instantiated before the container migration. Otherwise the standard `register` method has to be used.
   *
   * @private
   * @param namespace
   * @param name
   * @param klass
   * @param instance
   */
   registerInstantiatedSingleton<T = any>(namespace: string, name: string, klass: { new(): T }, instance: T): void;

  /**
   * Migrate the contents of the current DI container to another one in order to prepare replacing this container.
   *
   * @private
   * @param other
   */
   migrateTo(other: MigratableContainer): void;

}
