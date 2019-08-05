
export default interface QueryBuilder<M> {
  get(): Promise<M[]>;

  find(id: string): Promise<M|null>;

  first(): Promise<M|null>;

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
  filterAttr(attr: string, op: string, value: any): QueryBuilder<M>;

  /**
   * shorthand for:
   *    this.filterAttr(attr, "===", value);
   */
  filterAttrEq(attr: string, value: any): QueryBuilder<M>;
}
