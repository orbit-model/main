import HasOne from "../contracts/HasOne";
import { Model, RelationshipAdapter } from "@orbit-model/core";
import ApplicationDI from "@orbit-model/di";


export default class DefaultHasOne<Own extends Model, Related extends Model> implements HasOne<Related> {

  private relationship: string;
  private ownModel: Own;

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
    return ApplicationDI.getDI().get('middleware', 'relationshipAdapter');
  }
}
