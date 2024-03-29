import { ConnectionStrategy, ConnectionStrategyOptions } from "@orbit/coordinator";
import { Listener } from "@orbit/core";
import DefaultBranch from "./DefaultBranch";
import { Operation, Transform } from "@orbit/data";
import OperationProcessor from "./operationProcessors/OperationProcessor";
import UpdateRecord from "./operationProcessors/UpdateRecord";
import MemorySource from "@orbit/memory";
import ReplaceAttribute from "./operationProcessors/ReplaceAttribute";

export interface UpdateModelsStrategyOptions {
  /**
   * The name of the source to be observed.
   */
  source: string;

  /**
   * A handler for any errors thrown as a result of performing the action.
   */
  catch?: Function;
}

export default class UpdateModelsStrategy extends ConnectionStrategy {
  protected readonly branch: DefaultBranch;
  protected readonly operationProcessors: OperationProcessor[] = [new UpdateRecord(), new ReplaceAttribute()];

  constructor(branch: DefaultBranch, options: UpdateModelsStrategyOptions) {
    super({
      source: options.source,
      on: "transform",
      action: (): void => {},
      catch: options.catch,
    } as ConnectionStrategyOptions);
    this.branch = branch;
  }

  protected generateListener(): Listener {
    return (transform: Transform<any>): Promise<any> => {
      let promises = transform.operations.map(this.processOperation.bind(this));
      let result: Promise<any> = Promise.all(promises);

      if (this._catch) {
        result = result.catch((e: Error) => {
          // @ts-ignore
          return this._catch.apply(this, [e, transform]);
        });
      }
      return result;
    };
  }

  protected processOperation(operation: Operation): Promise<any> {
    let processor = this.operationProcessors.find((op: OperationProcessor): boolean => {
      return op.getOpCodes().includes(operation.op);
    });
    if (!processor) {
      return Promise.resolve();
    }
    console.log("running processor: ", processor.getOpCodes());
    return processor.run(operation, this.branch, this.source as MemorySource);
  }
}
