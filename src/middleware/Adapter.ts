import {Record} from '@orbit/data';
import AdapterContract from "../contracts/Adapter";
import Model from "../contracts/Model";


export default class Adapter implements AdapterContract {
  createFromRecord<T extends Model>(record: Record, setter?: (attr: string, value: any, model: T) => void): T {
    return undefined;
  }

  destroy<T extends Model>(model: T, getter?: (attr: string, model?: T) => any): Promise<void> {
    return undefined;
  }

  save<T extends Model>(model: T, getter?: (attr: string, model?: T) => any): Promise<void> {
    return undefined;
  }

  updateModel<T extends Model>(record: Record, model: T, getter?: (attr: string, model?: T) => any, setter?: (attr: string, value: any, model?: T) => void): void {
  }

}
