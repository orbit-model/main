import HasOne from "../contracts/HasOne";
import { Model, RelationshipAdapter } from "../../../contracts";
import { DI } from "@orbit-model/di";

export default class DefaultHasOne<Own extends Model, Related extends Model> implements HasOne<Related> {
  private readonly relationship: string;
  private readonly ownModel: Own;

  /**
   * @private
   * @param relationship
   * @param ownModel
   */
  constructor(relationship: string, ownModel: Own) {
    this.relationship = relationship;
    this.ownModel = ownModel;
  }

  get(): Promise<Related> {
    return this.getRelationshipAdapter().getRelatedModel(this.ownModel, this.relationship);
  }

  set(related: Related): Promise<void> {
    return this.getRelationshipAdapter().setRelatedModel(this.ownModel, related, this.relationship);
  }

  private getRelationshipAdapter(): RelationshipAdapter {
    return DI.get("system", "RelationshipAdapter");
  }
}
