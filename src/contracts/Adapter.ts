import Model from './Model';
import { Record } from "@orbit/data";

export default interface Adapter {
  createFromRecord<T extends Model>(record: Record, setter?: (attr: string, value: any, model: T) => void): T;

  updateModel<T extends Model>(
    record: Record,
    model: T,
    getter?: (attr: string, model?: T) => any,    // do we need a getter?
    setter?: (attr: string, value: any, model?: T) => void
  ): void;

  save<T extends Model>(model: T, getter?: (attr: string, model?: T) => any): Promise<void>;

  destroy<T extends Model>(model: T, getter?: (attr: string, model?: T) => any): Promise<void>;
}
