import LiteBranch from "../../contracts/LiteBranch";
import Store from "@orbit/store";
import Coordinator, { RequestStrategy, LogTruncationStrategy } from '@orbit/coordinator';
import Model from "../../contracts/Model";
import QueryBuilderZero from "../../contracts/QueryBuilderZero";
import ApplicationDI from "../../di/ApplicationDI";
import { uuid } from "@orbit/utils";

export default class DefaultLiteBranch implements LiteBranch<Model> {

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

  fork(): LiteBranch<Model> {
    return new DefaultLiteBranch(this.store);
  }

  mergeAndDestroy(): Promise<void> {
    this.coordinator.deactivate();
    return this.parent.merge(this.store);
  }

  abandon(): void {
    this.coordinator.deactivate();
  }

  query(queryBuilder: string = "queryBuilder"): QueryBuilderZero<Model> {
    return ApplicationDI.getDI().get("system", queryBuilder);
  }
}
