import { RecordIdentity } from "@orbit/records";
import { Model } from "@orbit-model/contracts";
import IdentityModelMap from "./IdentityModelMap";

export default class IdentityModelMapTypeMap implements Map<RecordIdentity, Model> {
  private readonly _map: Map<string, IdentityModelMap<Model>> = new Map<string, IdentityModelMap<Model>>();

  get<M extends Model>(identity: RecordIdentity): M | undefined {
    let imMap = this._map.get(identity.type);
    if (imMap === undefined) {
      return undefined;
    }
    return imMap.get(identity) as M;
  }

  set<M extends Model>(identity: RecordIdentity, record: Model): this {
    let imMap = this._map.get(identity.type);
    if (imMap === undefined) {
      imMap = new IdentityModelMap<M>(identity.type);
      this._map.set(identity.type, imMap);
    }
    imMap.set(identity, record);
    return this;
  }

  has(identity: RecordIdentity): boolean {
    let imMap = this._map.get(identity.type);
    if (imMap === undefined) {
      return false;
    }
    return imMap.has(identity);
  }

  delete(identity: RecordIdentity): boolean {
    let imMap = this._map.get(identity.type);
    if (imMap === undefined) {
      return false;
    }
    return imMap.delete(identity);
  }

  toArray(): [RecordIdentity, Model][] {
    return ([] as [RecordIdentity, Model][]).concat(
      ...Array.from(this._map).map(([_type, map]: [string, IdentityModelMap<Model>]): [RecordIdentity, Model][] => {
        return map.toArray();
      })
    );
  }

  entries(): IterableIterator<[RecordIdentity, Model]> {
    return this.toArray()[Symbol.iterator]();
  }

  keys(): IterableIterator<RecordIdentity> {
    return this.toArray()
      .map(([identity]) => identity)
      [Symbol.iterator]();
  }

  values(): IterableIterator<Model> {
    return this.toArray()
      .map(([_identity, model]) => model)
      [Symbol.iterator]();
  }

  [Symbol.iterator](): IterableIterator<[RecordIdentity, Model]> {
    return this.entries();
  }

  clear(): void {
    this._map.forEach(map => {
      map.clear();
    });
    this._map.clear();
  }

  forEach(
    callbackFn: (record: Model, identity: RecordIdentity, map: IdentityModelMapTypeMap) => void,
    thisArg?: any
  ): void {
    for (let [identity, record] of this) {
      callbackFn.call(thisArg, record, identity, this);
    }
  }

  get size(): number {
    let sum = 0;
    this._map.forEach(map => {
      sum += map.size;
    });
    return sum;
  }

  get [Symbol.toStringTag](): string {
    return "IdentityModelMapTypeMap";
  }
}
