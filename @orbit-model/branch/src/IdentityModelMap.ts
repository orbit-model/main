import IdentityMap, { IdentitySerializer } from "@orbit/identity-map";
import { Model } from "@orbit-model/contracts";
import Orbit, { RecordIdentity } from "@orbit/data";

export class Serializer implements IdentitySerializer<RecordIdentity> {
  private readonly type: string;

  constructor(type: string) {
    this.type = type;
  }

  deserialize(identifier: string): RecordIdentity {
    return {
      id: identifier,
      type: this.type
    };
  }

  serialize(identity: RecordIdentity): string {
    Orbit.assert("type matches", this.type === identity.type);
    return identity.id;
  }
}

export default class IdentityModelMap<MODEL extends Model> extends IdentityMap<RecordIdentity, MODEL> {
  private readonly _type: string;

  constructor(type: string) {
    super({
      serializer: new Serializer(type)
    });
    this._type = type;
  }

  get type(): string {
    return this._type;
  }

  toArray(): [RecordIdentity, MODEL][] {
    return Array.from(this._map).map(([identifier, record]): [RecordIdentity, MODEL] => [
      this._serializer.deserialize(identifier),
      record
    ]);
  }
}
