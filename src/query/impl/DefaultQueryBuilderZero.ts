import QueryBuilderZero from "../../contracts/QueryBuilderZero";
import Model from "../../model/Model";
import QueryBuilder from "../../contracts/QueryBuilder";
import classToDiName from "../../utils/classToDiName";
import DefaultQueryBuilder from "./DefaultQueryBuilder";

export default class DefaultQueryBuilderZero implements QueryBuilderZero<Model> {

  select<M extends Model>(klass: { new(): M } | string): QueryBuilder<M> {
    let diName;
    if (typeof klass === 'string') {
      diName = klass;
    } else {
      diName = classToDiName(klass);
    }
    return new DefaultQueryBuilder(diName);
  }

}
