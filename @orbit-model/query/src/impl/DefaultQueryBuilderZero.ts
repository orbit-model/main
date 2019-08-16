import classToDiName from "./utils/classToDiName";
import DefaultQueryBuilder from "./DefaultQueryBuilder";
import { Branch, Model, QueryBuilder, QueryBuilderZero } from "@orbit-model/contracts";
import { Container } from "@orbit-model/di";

export default class DefaultQueryBuilderZero implements QueryBuilderZero {

  private branch: Branch | null = null;
  private di: Container | null = null;

  setBranch(branch: Branch) {
    this.branch = branch;
  }

  _setOrbitDi(di: Container): void {
    this.di = di;
  }

  select<M extends Model>(klass: { new(): M } | string | any): QueryBuilder<M> {
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
