
export default interface QueryBuilder<M> {
  get(): Promise<M[]>;

  find(id: string): Promise<M>;

  first(): Promise<M>;

  //## builder methods ####################################

  sortBy(...attr: string[]): QueryBuilder<M>;

  /**
   * translates into:
   *    q.filter({ attribute, op, value })
   */
  filter(attr: string, op: string, value: any): QueryBuilder<M>;

  /**
   * shorthand for:
   *    this.filter(attr, "===", value);
   */
  filterEq(attr: string, value: any): QueryBuilder<M>;
}
