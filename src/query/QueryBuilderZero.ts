import QueryBuilder from "./QueryBuilder";
import BranchQuery from "./BranchQuery";

export default interface QueryBuilderZero<MODEL> extends BranchQuery<MODEL> {

  select<M extends MODEL>(klass: { new(): M } | string): QueryBuilder<M>;
}
