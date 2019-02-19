import QueryBuilder from "./QueryBuilder";
import BranchQuery from "./BranchQuery";
import { Model } from "@orbit-model/model";

export default interface QueryBuilderZero extends BranchQuery {

  select<M extends Model>(klass: { new(): M } | string): QueryBuilder<M>;
}
