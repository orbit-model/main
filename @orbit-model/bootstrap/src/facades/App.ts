import { Container, DefaultContainer, MigratableContainer } from "@orbit-model/di";

export default class App {

  private static di: MigratableContainer | null = null;

  public static getDI(): Container {
    if (App.di === null) {
      App.di = new DefaultContainer();
    }
    return App.di;
  }

  /**
   * Replaces the current container by calling the `migrateTo()` method.
   *
   * This method may be expensive, depending on the number of registered entries in the container.
   *
   * @param di
   */
  public static migrateDI(di: MigratableContainer): void {
    if (App.di !== null) {
      App.di.migrateTo(di);
    }
    App.di = di;
  }


}
