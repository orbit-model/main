import OrbitModelMeta from "../../contracts/OrbitModelMeta";
import Model from "../../contracts/Model";
import Branch from "../../contracts/Branch";

export default class DefaultOrbitModelMeta implements OrbitModelMeta<Model> {
  branch: Branch<Model>;
  className: string;
  orbitUUID: string;
  id: { remoteId?: string } = {};
  values: { [p: string]: any } = {};


  constructor(branch: Branch<Model>, className: string, orbitUUID: string) {
    this.branch = branch;
    this.className = className;
    this.orbitUUID = orbitUUID;
  }
}
