import QueryBuilder from "../QueryBuilder";
import Branch from "../../branching/Branch";
import Model from "../../model/Model";
import { KeyMap, RecordIdentity, Record } from "@orbit/data";
import Container from "../../di/Container";
import Adapter from "../../middleware/Adapter";

export default class DefaultQueryBuilder<M extends Model> implements QueryBuilder<M> {

  private branch: Branch<Model>;
  private modelDiName: string;
  private  di: Container;


  constructor(branch: Branch<Model>, modelDiName: string, di: Container) {
    this.branch = branch;
    this.modelDiName = modelDiName;
    this.di = di;
  }


  async find(id: string): Promise<M> {
    let rId : RecordIdentity = {
      type: this.modelDiName,
      id: this.getKeyMap().keyToId(this.modelDiName, "remoteId", id)
    };
    let record = await this.branch.getStore().query(q => q.findRecord(rId));

    let adapter: Adapter<Record, Model> = this.di.get('middleware', 'adapter');
    return adapter.createFromRecord<M>(record, this.branch);
  }

  async first(): Promise<M> {
    throw new Error("not implemented");
  }

  get(): Promise<M[]> {
    throw new Error("not implemented");
  }

  private getKeyMap(): KeyMap {
    return this.branch.getStore().cache.keyMap;
  }

  //## builder methods ####################################

  filter(attr: string, op: string, value: any): QueryBuilder<M> {
    return this;
  }

  filterEq(attr: string, value: any): QueryBuilder<M> {
    return this;
  }

  sortBy(...attr: string[]): QueryBuilder<M> {
    return this;
  }

}
