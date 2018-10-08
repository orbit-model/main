import { Record } from "@orbit/data";
import Injectable from "./Injectable";

export default interface Adapter<MODEL /* extends Model */> extends Injectable {
  createFromRecord<M extends MODEL>(
    record: Record,
    getter?: (attr: string, model?: M) => any,
    setter?: (attr: string, value: any, model: M) => void
  ): M;

  updateModel<M extends MODEL>(
    record: Record,
    model: M,
    getter?: (attr: string, model?: M) => any,
    setter?: (attr: string, value: any, model: M) => void
  ): void;

  save<M extends MODEL>(model: M, getter?: (attr: string, model: M) => any): Promise<void>;

  destroy<M extends MODEL>(model: M, getter?: (attr: string, model: M) => any): Promise<void>;
}
