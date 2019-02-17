import Injectable from "../di/Injectable";
import Branch from "../branching/Branch";

export default interface BranchQuery<MODEL> extends Injectable {
  setBranch(branch: Branch<MODEL>);
}
