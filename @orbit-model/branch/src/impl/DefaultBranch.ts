import Coordinator from "@orbit/coordinator";
import Memory from "@orbit/memory";
import { uuid } from "@orbit/utils";
import { DI } from "@orbit-model/di";
import { Branch, BranchQuery, Model, QueryBuilderZero } from "@orbit-model/contracts";
import IdentityModelMapTypeMap from "../IdentityModelMapTypeMap";
import { ModelSerializer } from "@orbit-model/middleware";
import BaseStrategy from "./BaseStrategy";
import ModelLogTruncationStrategy from "./ModelLogTruncationStrategy";
import UpdateModelsStrategy from "./UpdateModelsStrategy";

enum BranchState {
  ACTIVE,
  DESTROYED,
}

export default class DefaultBranch implements Branch {
  private branchState: BranchState;
  private readonly parent: null | Branch;
  private readonly memorySource: Memory;
  private readonly parentMemorySource: Memory;
  private readonly coordinator: Coordinator;
  private readonly modelsMap: IdentityModelMapTypeMap = new IdentityModelMapTypeMap();
  private promiseChain: undefined | Promise<any>;

  private constructor(parent: null | Branch, parentMemorySource: Memory) {
    this.parent = parent;
    this.parentMemorySource = parentMemorySource;
    this.memorySource = this.parentMemorySource.fork({
      name: `branch-${uuid()}`,
    });
    this.branchState = BranchState.ACTIVE;
    this.coordinator = new Coordinator({
      sources: [this.memorySource, this.parentMemorySource],
    });

    this.setupCoordinator();
  }

  private setupCoordinator(): void {
    // auto cleanup logs
    this.coordinator.addStrategy(new ModelLogTruncationStrategy());
    // enable querying for data
    this.coordinator.addStrategy(
      new BaseStrategy({
        source: this.memorySource.name || `branch-${uuid()}`, // todo: remove fallback
        target: this.parentMemorySource.name,
        on: "beforeQuery",
        action: "query",
        catch(...args: any[]): void {
          console.error("error while running BaseStrategy for querying: ", ...args);
        },
        afterListenerResult(): void {
          (this.source as Memory).rebase();
        },
      })
    );
    // enable auto syncing data
    this.coordinator.addStrategy(
      new BaseStrategy({
        source: this.parentMemorySource.name || `branch-${uuid()}`, // todo: remove fallback
        target: this.memorySource.name,
        on: "transform",
        action: "rebase",
        catch(...args: any[]): void {
          console.error("error while running BaseStrategy for synchronizing: ", ...args);
        },
      })
    );
    // enable auto updating models
    this.coordinator.addStrategy(
      new UpdateModelsStrategy(this, {
        // source: this.memorySource.name,
        source: this.parentMemorySource.name || `branch-${uuid()}`, // todo: remove fallback // todo: remove workaround
        catch(...args: any[]): void {
          console.error("error while running UpdateModelsStrategy for synchronizing: ", ...args);
        },
      })
    );
  }

  public static async factory(parent: null | Branch, memorySource: Memory): Promise<DefaultBranch> {
    let b = new DefaultBranch(parent, memorySource);
    await b.coordinator.activate();
    return b;
  }

  getMemorySource(): Memory {
    return this.memorySource;
  }

  fork(): Promise<Branch> {
    if (this.isActive()) {
      throw new Error("Branch has been deactivated!");
    }
    return DefaultBranch.factory(this, this.memorySource);
  }

  isActive(): boolean {
    if (this.branchState !== BranchState.ACTIVE) {
      return false;
    }
    if (this.parent !== null) {
      return this.parent.isActive();
    }
    return false;
  }

  _chain(promise: Promise<any>): void {
    if (this.promiseChain === undefined) {
      this.promiseChain = promise;
    } else {
      let temp = this.promiseChain;
      this.promiseChain = promise;
      promise.then(() => temp);
    }
  }

  settle(): Promise<any> {
    return this.promiseChain || Promise.resolve();
  }

  async mergeAndDestroy(): Promise<void> {
    if (this.isActive()) {
      throw new Error("Branch has been deactivated!");
    }
    this.branchState = BranchState.DESTROYED; // avoid concurrency issues
    await this.settle();
    await this.parentMemorySource.merge(this.memorySource);
    await this.abandon();
  }

  async abandon(): Promise<void> {
    this.modelsMap.clear();
    await this.coordinator.deactivate();
    await this.memorySource.deactivate();
    this.branchState = BranchState.DESTROYED;
  }

  registerModel<MODEL extends Model>(model: MODEL): void {
    if (this.isActive()) {
      throw new Error("Branch has been deactivated!");
    }
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

  /**
   * Only allow the UpdateModelStrategy class access to this property
   * @private
   */
  getModelMap(): IdentityModelMapTypeMap {
    return this.modelsMap;
  }
}
