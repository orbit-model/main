import Coordinator, {
  EventLoggingStrategy,
  LogLevel,
  LogTruncationStrategy,
  RequestStrategy
} from '@orbit/coordinator';
import Store from "@orbit/store";
import { uuid } from "@orbit/utils";
import { Branch, BranchQuery, QueryBuilderZero } from "@orbit-model/core";
import ApplicationDI from "@orbit-model/di";

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
    this.coordinator.addStrategy(new RequestStrategy({
      source: this.store.name,
      on: 'beforeQuery',

      target: this.parent.name,
      action: 'pull',

      blocking: true,
      catch(...args: any[]) {
        console.error("RequestStrategy query error: ", ...args);
        return null;
      }
    }));
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
