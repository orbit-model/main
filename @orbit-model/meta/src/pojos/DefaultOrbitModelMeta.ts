import OrbitModelMeta from "../OrbitModelMeta";
import { Branch } from "@orbit-model/branching";

export default class DefaultOrbitModelMeta implements OrbitModelMeta {
  branch: Branch;
  className: string;
  orbitUUID: string;
  id: { remoteId?: string } = {};
  values: { [p: string]: any } = {};


  constructor(branch: Branch, className: string, orbitUUID: string) {
    this.branch = branch;
    this.className = className;
    this.orbitUUID = orbitUUID;
  }
}
