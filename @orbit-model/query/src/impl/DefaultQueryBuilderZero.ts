import QueryBuilderZero from "../QueryBuilderZero";
import QueryBuilder from "..//QueryBuilder";
import classToDiName from "./utils/classToDiName";
import DefaultQueryBuilder from "./DefaultQueryBuilder";
import { Branch } from "@orbit-model/branching";
import { Container } from "@orbit-model/di";
import { Model } from "@orbit-model/model";

export default class DefaultQueryBuilderZero implements QueryBuilderZero<Model> {

  private branch: Branch<Model> | null = null;
  private di: Container | null = null;

  setBranch(branch: Branch<Model>) {
    this.branch = branch;
  }

  _setOrbitDi(di: Container): void {
    this.di = di;
  }

  select<M extends Model>(klass: { new(): M } | string): QueryBuilder<M> {
    let diName;
    if (typeof klass === 'string') {
      diName = klass;
    } else {
      diName = classToDiName(klass);
    }
    if (this.branch === null) {
      throw new Error("Please call DefaultQueryBuilderZero.setBranch() before using select()");
    }
    if (this.di === null) {
      throw new Error("Please instantiate DefaultQueryBuilderZero using the DI container");
    }
    return new DefaultQueryBuilder(this.branch, diName, this.di);
  }

}
