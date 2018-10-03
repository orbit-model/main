import { Record } from "@orbit/data";

export default interface Adapter<MODEL /* extends Model */> {
  createFromRecord<M extends MODEL>(record: Record, setter?: (attr: string, value: any, model: M) => void): M;

  updateModel<M extends MODEL>(
    record: Record,
    model: M,
    getter?: (attr: string, model?: M) => any,    // do we need a getter?
    setter?: (attr: string, value: any, model?: M) => void
  ): void;

  save<M extends MODEL>(model: M, getter?: (attr: string, model?: M) => any): Promise<void>;

  destroy<M extends MODEL>(model: M, getter?: (attr: string, model?: M) => any): Promise<void>;
}
