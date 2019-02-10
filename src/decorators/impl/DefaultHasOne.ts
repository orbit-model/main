import HasOne from "../../contracts/HasOne";
import Model from "../../contracts/Model";
import Container from "../../contracts/Container";
import RelationshipAdapter from "../../contracts/RelationshipAdapter";

export default class DefaultHasOne<Own extends Model, Related extends Model> implements HasOne<Related> {

  private relationship: string;
  private ownModel: Own;
  private di: Container;

  /**
   * @private
   * @param relationship
   * @param ownModel
   * @param di
   */
  constructor(relationship: string, ownModel: Own, di: Container) {
    this.relationship = relationship;
    this.ownModel = ownModel;
    this.di = di;
  }

  get(): Promise<Related> {
    return this.getRelationshipAdapter().getRelatedModel(this.ownModel, this.relationship);
  }

  set(related: Related): Promise<void> {
    return this.getRelationshipAdapter().setRelatedModel(this.ownModel, related, this.relationship);
  }


  private getRelationshipAdapter(): RelationshipAdapter<Model> {
    return this.di.get('middleware', 'relationshipAdapter');
  }
}
