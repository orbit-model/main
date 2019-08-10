import { Branch, OrbitModelMeta } from "@orbit-model/core";

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
