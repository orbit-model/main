import { Record } from "@orbit/data";

export default interface AdapterService<M> {

  afterCreate?(args: {model: M, setter?: (attr: string, value: any, model: M) => void }): void;
  afterCreateFill?(args: {model: M, setter?: (attr: string, value: any, model: M) => void }): void;

  beforeUpdate?(args: {
    record: Record,
    model: M,
    getter?: (attr: string, model?: M) => any,    // do we need a getter?
    setter?: (attr: string, value: any, model?: M) => void
  })

  // ...

}
