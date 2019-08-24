import Model from "./Model";
import BranchQuery from "./BranchQuery";
import QueryBuilder from "./QueryBuilder";
import ModelClass from "./ModelClass";

export default interface QueryBuilderZero extends BranchQuery {
  select<M extends Model>(klass: ModelClass<M> | string | any): QueryBuilder<M>;
}
