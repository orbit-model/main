import QueryBuilder from "../QueryBuilder";

export default class DefaultQueryBuilder<M> implements QueryBuilder<M> {

  private modelDiName: string;

  constructor(modelDiName: string){
    this.modelDiName = modelDiName;
  }

  find(id: string): Promise<M> {
    return undefined;
  }

  first(): Promise<M> {
    return this.get().then(models => models[0]);
  }

  get(): Promise<M[]> {
    return undefined;
  }

  //## builder methods ####################################

  filter(attr: string, op: string, value: any): QueryBuilder<M> {
    return undefined;
  }

  filterEq(attr: string, value: any): QueryBuilder<M> {
    return undefined;
  }

  sortBy(...attr: string[]): QueryBuilder<M> {
    return undefined;
  }

}
