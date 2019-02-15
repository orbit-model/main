import RootBranch from "../contracts/RootBranch";
import ApplicationDI from "../di/ApplicationDI";
import Store from "@orbit/store";
import DefaultRootBranch from "./impl/DefaultRootBranch";

export default class Branch {

  public static setup(store: Store): void {
    ApplicationDI.getDI().registerObject('system', 'root-branch', new DefaultRootBranch(store));
  }


  public static getRoot(): RootBranch {
    return ApplicationDI.getDI().get('system', 'root-branch');
  }
}
