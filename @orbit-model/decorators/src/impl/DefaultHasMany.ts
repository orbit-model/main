import HasMany from "../contracts/HasMany";
import { Model, RelationshipAdapter } from "../../../contracts";
import { DI } from "@orbit-model/di";

export default class DefaultHasMany<Own extends Model, Related extends Model> implements HasMany<Model> {
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
    return DI.get("system", "RelationshipAdapter");
  }
}
