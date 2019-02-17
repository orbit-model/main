import QueryBuilder from "./QueryBuilder";
import Injectable from "../di/Injectable";

export default interface QueryBuilderZero<MODEL> extends Injectable {

  select<M extends MODEL>(klass: { new(): M } | string): QueryBuilder<M>
}
