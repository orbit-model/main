import { MetaDataModel } from "@orbit-model/meta";

export default interface Model extends MetaDataModel {
  readonly type: string;
  id: string | undefined;

  destroy(): Promise<void>;
}
