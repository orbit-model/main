
export default interface QueryBuilder<M> {
  get(): Promise<M[]>;

  find(id: string): Promise<M|null>;

  first(): Promise<M|null>;

  //## builder methods ####################################

  sortBy(...attr: string[]): QueryBuilder<M>;

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
