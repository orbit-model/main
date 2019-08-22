import MetaDataModel from "./MetaDataModel";

export default interface Model extends MetaDataModel {
  readonly type: string;
  id: string | undefined;

  $destroy(): Promise<void>;
}
