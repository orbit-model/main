import {
  AttributeSortSpecifier,
  FilterSpecifier,
  FindRecords,
  KeyMap,
  PageSpecifier,
  RecordIdentity,
  SortOrder,
  SortSpecifier,
  ValueComparisonOperator
} from "@orbit/data";
import { Adapter, Branch, Model, QueryBuilder } from "@orbit-model/core";
import { Container } from "@orbit-model/di";

export default class DefaultQueryBuilder<M extends Model> implements QueryBuilder<M> {

  private readonly branch: Branch;
  private readonly modelDiName: string;
  private readonly di: Container;

  private querySort?: SortSpecifier[];
  private queryFilter?: FilterSpecifier[];
  private queryPage?: PageSpecifier = undefined;

  constructor(branch: Branch, modelDiName: string, di: Container) {
    this.branch = branch;
    this.modelDiName = modelDiName;
    this.di = di;
  }


  async find(id: string): Promise<M | null> {
    let rId: RecordIdentity = {
      type: this.modelDiName,
      id: this.getIdForKey(this.modelDiName, id)
    };
    let record = await this.branch.getMemorySource().query(q => q.findRecord(rId));

    let adapter = this.di.get<Adapter>('middleware', 'adapter');
    return adapter.createFromRecord<M>(record, this.branch);
  }

  async first(): Promise<M | null> {
    if (!this.queryPage) {
      this.queryPage = {
        kind: "offsetLimit",
        offset: 0,
        limit: 1
      }
    }

    let result = await this.get();
    if (result.length === 0) {
      return null;
    }
    return result[0];
  }

  async get(): Promise<M[]> {
    let records: [] = await this.branch.getMemorySource().query({
      op: 'findRecords',
      type: this.modelDiName,
      sort: this.querySort,
      filter: this.queryFilter,
      page: this.queryPage
    } as FindRecords);

    let adapter = this.di.get<Adapter>('middleware', 'adapter');
    return records.map(record => adapter.createFromRecord(record, this.branch))
  }

  private getKeyMap(): KeyMap {
    let keyMap = this.branch.getMemorySource().cache.keyMap;
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
      id = this.branch.getMemorySource().schema.generateId(type);
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

  filterAttr(attribute: string, op: ValueComparisonOperator, value: any): QueryBuilder<M> {
    if (this.queryFilter === undefined) {
      this.queryFilter = [];
    }
    this.queryFilter.push({
      kind: "attribute",
      op,
      attribute,
      value
    });
    return this;
  }

  filterAttrEq(attr: string, value: any): QueryBuilder<M> {
    return this.filterAttr(attr, "equal", value);
  }

  sortBy(...attrs: string[]): QueryBuilder<M> {
    this.sortImpl("ascending", attrs);
    return this;
  }

  sortByDesc(...attrs: string[]): QueryBuilder<M> {
    this.sortImpl("ascending", attrs);
    return this;
  }

  private sortImpl(order: SortOrder, attrs: string[]) {
    if (this.querySort === undefined) {
      this.querySort = [];
    }
    this.querySort.concat(
      attrs.map(attr => {
          return {
            kind: "attribute",
            attribute: attr,
            order: order
          } as AttributeSortSpecifier
        }
      )
    );
  }

}
