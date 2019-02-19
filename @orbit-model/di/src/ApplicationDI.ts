import Container from "./Container";
import DefaultContainer from "./impl/DefaultContainer";
import MigratableContainer from "./MigratableContainer";


export default class ApplicationDI {

  private static di: MigratableContainer | null = null;

  public static getDI(): Container {
    if (ApplicationDI.di === null) {
      ApplicationDI.di = new DefaultContainer();
    }
    return ApplicationDI.di;
  }

  /**
   * Replaces the current container by calling the `migrateTo()` method.
   *
   * This method may be expensive, depending on the number of registered entries in the container.
   *
   * @param di
   */
  public static replaceDI(di: MigratableContainer): void {
    if (ApplicationDI.di !== null) {
      ApplicationDI.di.migrateTo(di);
    }
    ApplicationDI.di = di;
  }

}
