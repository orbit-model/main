import Coordinator, { EventLoggingStrategy, LogLevel, LogTruncationStrategy } from "@orbit/coordinator";
import Memory from "@orbit/memory";
import { uuid } from "@orbit/utils";
import { Branch, BranchQuery, QueryBuilderZero } from "../../../contracts";
import DefaultBranchQueryStrategy from "./DefaultBranchQueryStrategy";
import { DI } from "@orbit-model/di";

export default class DefaultBranch implements Branch {
  private readonly memorySource: Memory;
  private readonly parent: Memory;
  private readonly coordinator: Coordinator;

  private constructor(parent: Memory) {
    this.memorySource = parent.fork({
      name: `branch-${uuid()}`
    });
    this.parent = parent;
    this.coordinator = new Coordinator({
      sources: [this.memorySource, this.parent],
      defaultActivationOptions: {
        //    logLevel: LogLevel.Info
      }
    });
    this.coordinator.addStrategy(new LogTruncationStrategy());
    // this.coordinator.addStrategy(new EventLoggingStrategy({
    //   logLevel: LogLevel.Info
    // }));
    this.coordinator.addStrategy(
      new DefaultBranchQueryStrategy({
        source: this.memorySource.name,
        target: this.parent.name,
        catch(...args: any[]) {
          console.error("error while running DefaultBranchQueryStrategy: ", ...args);
        }
      })
    );
    // this.coordinator.addStrategy(new RequestStrategy({
    //   source: this.memorySource.name,
    //   on: 'beforeQuery',
    //
    //   target: this.parent.name,
    //   action: 'query',
    //   // action: async function (data: any) {
    //   //   try {
    //   //     // @ts-ignore
    //   //     let result = await this.target.query(data);
    //   //     // @ts-ignore
    //   //     console.log("result: ", result);
    //   //     return result;
    //   //     // @ts-ignore
    //   //     //this.hints['data'] = result;
    //   //     // console.log("source: ", this.source.update);
    //   //     // if (Array.isArray(result)) {
    //   //     //   // @ts-ignore
    //   //     //   await this.source.update(t => result.map(r => t.updateRecord(r)));
    //   //     // } else {
    //   //     //   // @ts-ignore
    //   //     //   await this.source.update(t => t.updateRecord(result));
    //   //     // }
    //   //     // @ts-ignore
    //   //     // console.log("result2: ", this.source.query);
    //   //     // @ts-ignore
    //   //     // await this.source.merge(this.target).then(() => {
    //   //     //   console.log("TEST");
    //   //     //   throw new Error("TEST");
    //   //     // });
    //   //   } catch (e) {
    //   //     console.log("ERROR! ", e.message);
    //   //   }
    //   // },
    //
    //   passHints: true,
    //   blocking: true,
    //
    //   catch(...args: any[]) {
    //     console.log('caught an error: ', ...args);
    //   }
    // }));
    // Sync all changes received from the remote server to the memorySource
    // this.coordinator.addStrategy(new SyncStrategy({
    //   source: this.parent.name,
    //   target: this.memorySource.name,
    //   blocking: true
    // }));
  }

  public static async factory(parent: Memory): Promise<DefaultBranch> {
    let b = new DefaultBranch(parent);
    await b.coordinator.activate();
    return b;
  }

  getMemorySource(): Memory {
    return this.memorySource;
  }

  fork(): Promise<Branch> {
    return DefaultBranch.factory(this.memorySource);
  }

  async mergeAndDestroy(): Promise<void> {
    await this.coordinator.deactivate();
    await this.parent.merge(this.memorySource);
  }

  abandon(): void {
    this.coordinator.deactivate();
  }

  query<Q extends BranchQuery = QueryBuilderZero>(queryBuilder: string = "QueryBuilder"): Q {
    let qb = DI.get<Q>("system", queryBuilder);
    if (typeof qb["setBranch"] === "function") {
      qb["setBranch"](this);
    }
    return qb;
  }
}
