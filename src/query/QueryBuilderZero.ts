import QueryBuilder from "../../dist/contracts/QueryBuilder";

export default interface QueryBuilderZero<MODEL> {

  select<M extends MODEL>(klass: { new(): M } | string): QueryBuilder<M>
}
