import Coordinator, {
  EventLoggingStrategy,
  LogLevel,
  LogTruncationStrategy,
} from '@orbit/coordinator';
import Store from "@orbit/store";
import { uuid } from "@orbit/utils";
import { Branch, BranchQuery, QueryBuilderZero } from "@orbit-model/core";
import ApplicationDI from "@orbit-model/di";
import DefaultBranchQueryStrategy from "./DefaultBranchQueryStrategy";

export default class DefaultBranch implements Branch {

  private readonly store: Store;
  private readonly parent: Store;
  private readonly coordinator: Coordinator;

  private constructor(parent: Store) {
    this.store = parent.fork({
      name: `branch-${uuid()}`
    });
    this.parent = parent;
    this.coordinator = new Coordinator({
      sources: [this.store, this.parent],
      defaultActivationOptions: {
        logLevel: LogLevel.Info
      }
    });
    this.coordinator.addStrategy(new LogTruncationStrategy());
    this.coordinator.addStrategy(new EventLoggingStrategy({
      logLevel: LogLevel.Info
    }));
    this.coordinator.addStrategy(new DefaultBranchQueryStrategy({
      source: this.store.name,
      target: this.parent.name,
      catch(...args: any[]){
        console.error("error while running DefaultBranchQueryStrategy: ", ...args);
      }
    }));
    // this.coordinator.addStrategy(new RequestStrategy({
    //   source: this.store.name,
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
    // Sync all changes received from the remote server to the store
    // this.coordinator.addStrategy(new SyncStrategy({
    //   source: this.parent.name,
    //   target: this.store.name,
    //   blocking: true
    // }));
  }

  public static async factory(parent: Store): Promise<DefaultBranch> {
    let b = new DefaultBranch(parent);
    await b.coordinator.activate();
    return b;
  }


  getStore(): Store {
    return this.store;
  }

  fork(): Promise<Branch> {
    return DefaultBranch.factory(this.store);
  }

  async mergeAndDestroy(): Promise<void> {
    await this.coordinator.deactivate();
    await this.parent.merge(this.store);
  }

  abandon(): void {
    this.coordinator.deactivate();
  }

  query<Q extends BranchQuery = QueryBuilderZero>(queryBuilder: string = "queryBuilder"): Q {
    let qb = ApplicationDI.getDI().get<Q>("system", queryBuilder);
    if (typeof qb["setBranch"] === "function") {
      qb["setBranch"](this);
    }
    return qb;
  }

}
