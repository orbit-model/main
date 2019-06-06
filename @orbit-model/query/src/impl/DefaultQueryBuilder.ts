import { KeyMap, RecordIdentity } from "@orbit/data";
import { Adapter, Branch, Model, QueryBuilder } from "@orbit-model/core";
import { Container } from "@orbit-model/di";

export default class DefaultQueryBuilder<M extends Model> implements QueryBuilder<M> {

  private branch: Branch;
  private modelDiName: string;
  private di: Container;


  constructor(branch: Branch, modelDiName: string, di: Container) {
    this.branch = branch;
    this.modelDiName = modelDiName;
    this.di = di;
  }


  async find(id: string): Promise<M|null> {
    let rId: RecordIdentity = {
      type: this.modelDiName,
      id: this.getIdForKey(this.modelDiName, id)
    };
    let record = await this.branch.getStore().query(q => q.findRecord(rId));

    let adapter = this.di.get<Adapter>('middleware', 'adapter');
    return adapter.createFromRecord<M>(record, this.branch);
  }

  async first(): Promise<M|null> {
    throw new Error("not implemented");
  }

  async get(): Promise<M[]> {
    throw new Error("not implemented");
  }

  private getKeyMap(): KeyMap {
    let keyMap = this.branch.getStore().cache.keyMap;
    if (keyMap === undefined) {
      throw new Error("You have to add a KeyMap to your StoreSettings!");
    }
    return keyMap;
  }

  private getIdForKey(type: string, remoteId: string): string {
    let keyMap = this.getKeyMap();
    let id = keyMap.keyToId(type, "remoteId", remoteId);
    if (id === undefined) {
      // remoteId value is not known by keyMap -> push new mapping
      id = this.branch.getStore().schema.generateId(type);
      keyMap.pushRecord({
        type,
        id,
        keys: {
          remoteId
        }
      });
    }
    return id;
  }

  //## builder methods ####################################

  filterAttr(attr: string, op: string, value: any): QueryBuilder<M> {
    return this;
  }

  filterAttrEq(attr: string, value: any): QueryBuilder<M> {
    return this;
  }

  sortBy(...attr: string[]): QueryBuilder<M> {
    return this;
  }

}
