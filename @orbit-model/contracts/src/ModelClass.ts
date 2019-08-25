import Branch from "./Branch";
import Model from "./Model";

export interface ModelClassOptions {
  branch: Branch;
  uuid: string;
  ids: {
    remoteId?: string;
  };
}

export default interface ModelClass<MODEL extends Model = Model> {
  new (branch: Branch, ...args: any[]): MODEL;

  new (branch: ModelClassOptions, ...args: any[]): MODEL;
}
