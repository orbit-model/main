import MigratableContainer from "./MigratableContainer";
import Container from "./Container";
import DefaultContainer from "./impl/DefaultContainer";

export default class AppDI {
  private static di: MigratableContainer | null = null;

  public static getDI(): Container {
    if (AppDI.di === null) {
      AppDI.di = new DefaultContainer();
    }
    return AppDI.di;
  }

  /**
   * Replaces the current container by calling the `migrateTo()` method.
   *
   * This method may be expensive, depending on the number of registered entries in the container.
   *
   * @param di
   */
  public static migrateTo(di: MigratableContainer): void {
    if (AppDI.di !== null) {
      AppDI.di.migrateTo(di);
      return;
    }
    AppDI.di = di;
  }
}
