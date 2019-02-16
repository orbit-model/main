import { Record } from "@orbit/data";
import Injectable from "./Injectable";
import Getter from "./Getter";
import Setter from "./Setter";
import LiteBranch from "./LiteBranch";


export default interface Adapter<MODEL /* extends Model */> extends Injectable {
  createFromRecord<M extends MODEL>(record: Record, branch: LiteBranch<MODEL>, getter?: Getter<M>, setter?: Setter<M>): M;

  updateModel<M extends MODEL>(record: Record, model: M, getter?: Getter<M>, setter?: Setter<M>): void;

  save<M extends MODEL>(model: M, getter?: Getter<M>, setter?: Setter<M>): Promise<void>;

  destroy<M extends MODEL>(model: M, getter?: Getter<M>, setter?: Setter<M>): Promise<void>;
}
