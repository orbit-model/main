import Coordinator, { RequestStrategy, LogTruncationStrategy } from '@orbit/coordinator';
import Store from "@orbit/store";
import { uuid } from "@orbit/utils";
import { Branch,QueryBuilderZero } from "@orbit-model/core";
import ApplicationDI from "@orbit-model/di";
import { BranchQuery,  } from "@orbit-model/query";

export default class DefaultBranch implements Branch {

  private readonly store: Store;
  private readonly parent: Store;
  private readonly coordinator: Coordinator;

  constructor(parent: Store) {
    this.store = parent.fork({
      name: `store-fork-${uuid()}`
    });
    this.parent = parent;
    this.coordinator = new Coordinator({
      sources: [this.store, this.parent]
    });
    this.coordinator.addStrategy(new LogTruncationStrategy());
    this.coordinator.addStrategy(new RequestStrategy({
      source: this.parent.name,
      on: 'beforeQuery',
      target: this.store.name,
      action: 'pull',
      blocking: true
    }));
    this.coordinator.activate();
  }


  getStore(): Store {
    return this.store;
  }

  fork(): Branch {
    return new DefaultBranch(this.store);
  }

  mergeAndDestroy(): Promise<void> {
    this.coordinator.deactivate();
    return this.parent.merge(this.store);
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
