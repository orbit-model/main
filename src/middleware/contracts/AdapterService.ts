import { Record } from "@orbit/data";
import Setter from "../../contracts/Setter";
import Getter from "../../contracts/Getter";

export default interface AdapterService<MODEL> {

  /**
   * This hook will be called after the model class is resolved form the DI but before it is instantiated.
   * It is probably your last chance to modify (or even switch out) the model class before it's instantiation.
   *
   * @param args
   */
  beforeCreate?<M extends MODEL>(args: { modelKlass: { new(): M }, record: Record })

  afterCreate?<M extends MODEL>(args: { model: M, getter: Getter<M>, setter: Setter<M> }): void;

  afterCreateFill?<M extends MODEL>(args: { model: M, getter: Getter<M>, setter: Setter<M> }): void;


  beforeUpdate?<M extends MODEL>(args: { record: Record, model: M, getter: Getter<M>, setter: Setter<M> }): void;

  afterUpdate?<M extends MODEL>(args: { record: Record, model: M, getter: Getter<M>, setter: Setter<M> }): void;

  // ...

}
