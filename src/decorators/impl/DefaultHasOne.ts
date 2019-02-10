import HasOne from "../../contracts/HasOne";
import Store from "@orbit/store";
import Model from "../../contracts/Model";
import ModelSerializer from "../../middleware/ModelSerializer";
import Container from "../../contracts/Container";
import ModelMetaAccessors from "../../meta/ModelMetaAccessors";

export default class DefaultHasOne<Parent extends Model, Related extends Model> implements HasOne<Related> {

  private relationShip: String;
  private parent: Parent;
  private di: Container;


  constructor(relationShip: String, parent: Parent, di: Container) {
    this.relationShip = relationShip;
    this.parent = parent;
    this.di = di;
  }

  get(): Promise<Related> {
    let store: Store = ModelMetaAccessors.getMeta(this.parent).branch.getStore();
    return store.query(q => q.findRelatedRecord({ type: 'moon', id: 'io' }, 'planet'));
  }

  set(related: Related): Promise<void> {
    let store: Store = ModelMetaAccessors.getMeta(this.parent).branch.getStore();
    let serializer: ModelSerializer<Model> = this.di.get('system', 'modelSerializer');

    return store.update(
      t => t.replaceRelatedRecord(
        serializer.getIdentity(this.parent),
        this.relationShip,
        serializer.getIdentity(related)
      )
    );
  }
}
