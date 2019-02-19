import { Injectable } from "@orbit-model/di";
import { Branch } from "@orbit-model/branching";

export default interface BranchQuery<MODEL> extends Injectable {
  setBranch(branch: Branch<MODEL>): void;
}
