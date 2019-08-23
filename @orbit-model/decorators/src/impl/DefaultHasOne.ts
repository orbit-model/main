import HasOne from "../contracts/HasOne";
import { Model, RelationshipAdapter } from "../../../contracts";
import { DI } from "@orbit-model/di";

export default class DefaultHasOne<OWN extends Model, RELATED extends Model> implements HasOne<RELATED> {
  private readonly relationship: string;
  private readonly ownModel: OWN;

  /**
   * @private
   * @param relationship
   * @param ownModel
   */
  constructor(relationship: string, ownModel: OWN) {
    this.relationship = relationship;
    this.ownModel = ownModel;
  }

  get(): Promise<RELATED> {
    return this.getRelationshipAdapter().getRelatedModel(this.ownModel, this.relationship);
  }

  set(related: RELATED): Promise<void> {
    return this.getRelationshipAdapter().setRelatedModel(this.ownModel, related, this.relationship);
  }

  private getRelationshipAdapter(): RelationshipAdapter {
    return DI.get("system", "RelationshipAdapter");
  }
}
