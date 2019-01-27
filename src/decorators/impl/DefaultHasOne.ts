import HasOne from "../../contracts/HasOne";
import Store from "@orbit/store";
import Model from "../../contracts/Model";
import ModelSerializer from "../../middleware/ModelSerializer";
import HiddenOrbitProp from "../../contracts/HiddenOrbitProp";
import Container from "../../contracts/Container";

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
    let store: Store = this.parent.__orbit.branch.getStore();
    return store.query(q => q.findRelatedRecord({ type: 'moon', id: 'io' }, 'planet'));
  }

  set(related: Related): Promise<void> {
    let store: Store = this.parent.__orbit.branch.getStore();
    let serializer: ModelSerializer<HiddenOrbitProp, Model> = this.di.get('system', 'modelSerializer');

    return store.update(
      t => t.replaceRelatedRecord(
        serializer.getIdentity(this.parent),
        this.relationShip,
        serializer.getIdentity(related)
      )
    );
  }
}
