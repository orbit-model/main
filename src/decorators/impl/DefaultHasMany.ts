import Model from "../../contracts/Model";
import HasMany from "../../contracts/HasMany";
import Container from "../../contracts/Container";
import RelationshipAdapter from "../../contracts/RelationshipAdapter";

export default class DefaultHasMany<Own extends Model, Related extends Model> implements HasMany<Model> {

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


  getAll(): Promise<Model[]> {
    return this.getRelationshipAdapter().getAllRelatedModels(this.ownModel, this.relationship);
  }

  add(model: Model): Promise<void> {
    return this.getRelationshipAdapter().addRelatedModel(this.ownModel, model, this.relationship);
  }

  remove(model: Model): Promise<void> {
    return this.getRelationshipAdapter().removeRelatedModel(this.ownModel, model, this.relationship);
  }

  replaceAll(models: Model[]): Promise<void> {
    return this.getRelationshipAdapter().replaceRelatedModels(this.ownModel, models, this.relationship);
  }

  sync(models: Model[]): Promise<void> {
    return this.getRelationshipAdapter().syncRelatedModels(this.ownModel, models, this.relationship);
  }


  private getRelationshipAdapter(): RelationshipAdapter<Model> {
    return this.di.get('middleware', 'relationshipAdapter');
  }
}
