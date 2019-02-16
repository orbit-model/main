import OrbitModelMeta from "../../contracts/OrbitModelMeta";
import Model from "../../contracts/Model";
import LiteBranch from "../../contracts/LiteBranch";

export default class DefaultOrbitModelMeta implements OrbitModelMeta<Model> {
  branch: LiteBranch<Model>;
  className: string;
  orbitUUID: string;
  id: { remoteId?: string };


  constructor(branch: LiteBranch<Model>, className: string, orbitUUID: string) {
    this.branch = branch;
    this.className = className;
    this.orbitUUID = orbitUUID;
    this.id = {};
  }
}
