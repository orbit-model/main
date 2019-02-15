import Container from "../contracts/Container";
import DefaultContainer from "./impl/DefaultContainer";
import MigratableContainer from "./MigratableContainer";

export default class ApplicationDI {

  private static di: MigratableContainer = null;

  public static getDI(): Container {
    if (ApplicationDI.di === null) {
      ApplicationDI.di = new DefaultContainer();
      ApplicationDI.initWithDefaults();
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
    ApplicationDI.di.migrateTo(di);
    ApplicationDI.di = di;
  }

  /**
   * initializes the registry with the default implementations
   */
  private static initWithDefaults(): void {
    let di = ApplicationDI.di;
  }

}
