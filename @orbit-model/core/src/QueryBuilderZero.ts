import Model from "./Model";
import BranchQuery from "./BranchQuery";
import QueryBuilder from "./QueryBuilder";

export default interface QueryBuilderZero extends BranchQuery {

  select<M extends Model>(klass: { new(): M } | string): QueryBuilder<M>;
}
