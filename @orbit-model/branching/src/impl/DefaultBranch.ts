import Branch from "../Branch";
import Store from "@orbit/store";
import Coordinator, { RequestStrategy, LogTruncationStrategy } from '@orbit/coordinator';
import Model from "../../model/Model";
import QueryBuilderZero from "../../query/QueryBuilderZero";
import ApplicationDI from "../../di/ApplicationDI";
import { uuid } from "@orbit/utils";
import BranchQuery from "../../query/BranchQuery";

export default class DefaultBranch implements Branch<Model> {

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

  fork(): Branch<Model> {
    return new DefaultBranch(this.store);
  }

  mergeAndDestroy(): Promise<void> {
    this.coordinator.deactivate();
    return this.parent.merge(this.store);
  }

  abandon(): void {
    this.coordinator.deactivate();
  }

  query<Q extends BranchQuery<Model> = QueryBuilderZero<Model>>(queryBuilder: string = "queryBuilder"): Q {
    let qb = ApplicationDI.getDI().get<Q>("system", queryBuilder);
    if (typeof qb["setBranch"] === "function") {
      qb["setBranch"](this);
    }
    return qb;
  }
}
