import Branch from "./Branch";
import { Injectable } from "@orbit-model/di";

export default interface BranchQuery extends Injectable {
  setBranch(branch: Branch): void;
}
