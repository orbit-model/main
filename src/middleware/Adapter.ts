import Injectable from "../contracts/Injectable";
import Branch from "../branching/Branch";


export default interface Adapter<RECORD, MODEL> extends Injectable {

  /**
   * create a new model instance on the given branch
   *
   * @param record
   * @param branch
   */
  createFromRecord<M extends MODEL>(record: RECORD, branch: Branch<MODEL>): M;

  /**
   * update the (cached) data of a model
   */
  updateModel<M extends MODEL>(record: RECORD, model: M): void;

  /**
   * sets an individual value on a model and propagates it to the store
   */
  setAttrValue<M extends MODEL>(model: M, attribute: string, value: any): Promise<void>;

  /**
   * saves all values on a model to the store
   */
  save<M extends MODEL>(model: M): Promise<void>;

  /**
   * marks a given model as ready for deletion from the server (if the branch is ever merged)
   */
  destroy<M extends MODEL>(model: M): Promise<void>;
}
