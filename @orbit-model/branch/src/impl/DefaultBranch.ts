import Coordinator, { LogTruncationStrategy } from "@orbit/coordinator";
import Memory from "@orbit/memory";
import { uuid } from "@orbit/utils";
import DefaultBranchQueryStrategy from "./DefaultBranchQueryStrategy";
import { DI } from "@orbit-model/di";
import { Branch, BranchQuery, Model, QueryBuilderZero } from "@orbit-model/contracts";
import IdentityModelMapTypeMap from "../IdentityModelMapTypeMap";

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
    this.coordinator.addStrategy(new LogTruncationStrategy());
    this.coordinator.addStrategy(
      new DefaultBranchQueryStrategy({
        source: this.memorySource.name,
        target: this.parent.name,
        catch(...args: any[]): void {
          console.error("error while running DefaultBranchQueryStrategy: ", ...args);
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
    this.coordinator.deactivate();
  }

  registerModel<MODEL extends Model>(model: MODEL): void {
    // todo: implement
    // this.modelsMap.set()
  }

  unregisterModel<MODEL extends Model>(model: MODEL): void {
    // todo: implement
  }

  query<Q extends BranchQuery = QueryBuilderZero>(queryBuilder = "QueryBuilder"): Q {
    let qb = DI.get<Q>("system", queryBuilder);
    if (typeof qb["setBranch"] === "function") {
      qb["setBranch"](this);
    }
    return qb;
  }
}
