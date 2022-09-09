import { SetComparisonOperator, ValueComparisonOperator } from "@orbit/records";
import Model from "./Model";

export default interface QueryBuilder<M extends Model> {
  get(): Promise<M[]>;

  find(id: string): Promise<M | null>;

  first(): Promise<M | null>;

  //## builder methods ####################################

  /**
   * add a list of attributes to sort by in ascending order
   * @param attr
   */
  sortBy(...attr: string[]): QueryBuilder<M>;

  /**
   * add a list of attributes to sort by in descending order
   * @param attr
   */
  sortByDesc(...attr: string[]): QueryBuilder<M>;

  /**
   * translates into:
   *    q.filterAttr({ attribute, op, value })
   */
  filterAttr(attr: string, op: ValueComparisonOperator, value: any): QueryBuilder<M>;

  /**
   * shorthand for:
   *    this.filterAttr(attr, "equal", value);
   */
  filterAttrEq(attr: string, value: any): QueryBuilder<M>;

  /**
   * Filter the list of models of type M by given related model/models of type R
   */
  filterRelatedModel<R extends Model>(op: SetComparisonOperator, models: R | R[]): QueryBuilder<M>;

  /**
   * Filter the list of models of type M by given related models of type R
   */
  filterRelatedModels<R extends Model>(op: SetComparisonOperator, models: R[]): QueryBuilder<M>;
}
