import MetaDataModel from "./MetaDataModel";

export default interface Model extends MetaDataModel {
  readonly type: string;
  id: string | undefined;

  $destroy(): Promise<void>;
  $save(): Promise<void>;

  /**
   * either model has been deleted from the parent branch and possibly the server
   */
  $isDeleted(): boolean;
}
