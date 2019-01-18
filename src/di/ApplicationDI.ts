import Container from "../contracts/Container";
import DefaultContainer from "./impl/DefaultContainer";
import MigratableContainer from "./MigratableContainer";

export default class ApplicationDI {

  private static di: MigratableContainer = new DefaultContainer();

  public static getDI(): Container {
    return this.di;
  }

  /**
   * Replaces the current container by calling the `migrateTo()` method.
   *
   * This method may be expensive, depending on the number of registered entries in the container.
   *
   * @param di
   */
  public static replaceDI(di: MigratableContainer): void {
    this.di.migrateTo(di);
    this.di = di;
  }

}
