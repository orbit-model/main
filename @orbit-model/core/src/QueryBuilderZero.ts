import Model from "./Model";
import QueryBuilder from "../../query/src/QueryBuilder";
import BranchQuery from "./BranchQuery";

export default interface QueryBuilderZero extends BranchQuery {

  select<M extends Model>(klass: { new(): M } | string): QueryBuilder<M>;
}
