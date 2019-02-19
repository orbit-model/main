import HasMany from "../contracts/HasMany";
import ApplicationDI from "@orbit-model/di";
import { RelationshipAdapter } from "@orbit-model/middleware";
import { Model } from "@orbit-model/model";

export default class DefaultHasMany<Own extends Model, Related extends Model> implements HasMany<Model> {

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


  private getRelationshipAdapter(): RelationshipAdapter {
    return ApplicationDI.getDI().get('middleware', 'relationshipAdapter');
  }
}
