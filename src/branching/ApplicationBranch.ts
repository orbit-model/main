import RootBranch from "../contracts/RootBranch";
import ApplicationDI from "../di/ApplicationDI";
import Store from "@orbit/store";
import DefaultRootBranch from "./impl/DefaultRootBranch";
import Model from "../contracts/Model";

export default class ApplicationBranch {

  public static setup(store: Store): void {
    ApplicationDI.getDI().registerObject('system', 'rootBranch', new DefaultRootBranch(store));
  }


  public static getRoot(): RootBranch<Model> {
    return ApplicationDI.getDI().get('system', 'rootBranch');
  }
}
