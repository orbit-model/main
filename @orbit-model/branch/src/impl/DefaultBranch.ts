import Coordinator from "@orbit/coordinator";
import Memory from "@orbit/memory";
import { uuid } from "@orbit/utils";
import { DI } from "@orbit-model/di";
import { Branch, BranchQuery, Model, QueryBuilderZero } from "@orbit-model/contracts";
import IdentityModelMapTypeMap from "../IdentityModelMapTypeMap";
import { ModelSerializer } from "@orbit-model/middleware";
import BaseStrategy from "./BaseStrategy";
import ModelLogTruncationStrategy from "./ModelLogTruncationStrategy";

export default class DefaultBranch implements Branch {
  private readonly memorySource: Memory;
  private readonly parent: Memory;
  private readonly coordinator: Coordinator;
  private readonly modelsMap: IdentityModelMapTypeMap = new IdentityModelMapTypeMap();

  private constructor(parent: Memory) {
    this.memorySource = parent.fork({
      name: `branch-${uuid()}`
    });
    this.parent = parent;
    this.coordinator = new Coordinator({
      sources: [this.memorySource, this.parent]
    });

    // auto cleanup logs
    this.coordinator.addStrategy(new ModelLogTruncationStrategy());
    // enable querying for data
    this.coordinator.addStrategy(
      new BaseStrategy({
        source: this.memorySource.name,
        target: this.parent.name,
        on: "beforeQuery",
        action: "query",
        catch(...args: any[]): void {
          console.error("error while running BaseStrategy for querying: ", ...args);
        },
        afterListenerResult(): void {
          (this.source as Memory).rebase();
        }
      })
    );
    // enable auto syncing data
    this.coordinator.addStrategy(
      new BaseStrategy({
        source: this.parent.name,
        target: this.memorySource.name,
        on: "transform",
        action: "sync",
        catch(...args: any[]): void {
          console.error("error while running BaseStrategy for synchronizing: ", ...args);
        },
        afterListenerResult(): void {
          (this.target as Memory).rebase();
        }
      })
    );
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
    this.modelsMap.clear();
    this.coordinator.deactivate();
  }

  registerModel<MODEL extends Model>(model: MODEL): void {
    this.modelsMap.set(ModelSerializer.getIdentity(model), model);
  }

  unregisterModel<MODEL extends Model>(model: MODEL): void {
    this.modelsMap.delete(ModelSerializer.getIdentity(model));
  }

  query<Q extends BranchQuery = QueryBuilderZero>(queryBuilder = "QueryBuilder"): Q {
    let qb = DI.get<Q>("system", queryBuilder);
    if (typeof qb["setBranch"] === "function") {
      qb["setBranch"](this);
    }
    return qb;
  }
}
