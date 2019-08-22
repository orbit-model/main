import { Branch, OrbitModelMeta } from "@orbit-model/contracts";

export default class DefaultOrbitModelMeta implements OrbitModelMeta {
  branch: Branch;
  className: string;
  orbitUUID: string;
  ids: {
    remoteId?: string
  };
  values: {
    [p: string]: any
  };


  constructor(branch: Branch, className: string, orbitUUID: string) {
    this.branch = branch;
    this.className = className;
    this.orbitUUID = orbitUUID;
    this.ids = {};
    this.values = {};
  }
}
