import Model from './Model';
import { Record } from "@orbit/data";

export default interface Adapter<M /* extends Model */> {
  createFromRecord(record: Record, setter?: (attr: string, value: any, model: M) => void): M;

  updateModel(
    record: Record,
    model: M,
    getter?: (attr: string, model?: M) => any,    // do we need a getter?
    setter?: (attr: string, value: any, model?: M) => void
  ): void;

  save(model: M, getter?: (attr: string, model?: M) => any): Promise<void>;

  destroy(model: M, getter?: (attr: string, model?: M) => any): Promise<void>;
}
