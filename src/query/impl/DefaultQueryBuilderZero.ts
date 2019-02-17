import QueryBuilderZero from "../QueryBuilderZero";
import Model from "../../model/Model";
import QueryBuilder from "..//QueryBuilder";
import classToDiName from "../../utils/classToDiName";
import DefaultQueryBuilder from "./DefaultQueryBuilder";
import Branch from "../../branching/Branch";
import Container from "../../di/Container";

export default class DefaultQueryBuilderZero implements QueryBuilderZero<Model> {

  private branch: Branch<Model>;
  private di: Container;

  constructor(branch: Branch<Model>) {
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
    return new DefaultQueryBuilder(this.branch, diName, this.di);
  }

}
