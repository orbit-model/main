import { Branch, OrbitModelMeta } from "@orbit-model/contracts";

export default class DefaultOrbitModelMeta implements OrbitModelMeta {
  readonly branch: Branch;
  readonly className: string;
  readonly orbitUUID: string;
  readonly ids: {
    remoteId?: string;
  };
  readonly values: {
    [p: string]: any;
  };

  constructor(branch: Branch, className: string, orbitUUID: string, remoteId: string | undefined = undefined) {
    this.branch = branch;
    this.className = className;
    this.orbitUUID = orbitUUID;
    this.ids = {
      remoteId
    };
    this.values = {};
  }
}
