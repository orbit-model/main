import { RecordIdentity } from '@orbit/data';
import { Dict } from '@orbit/utils';
import Injectable from "../contracts/Injectable";
import Getter from "../contracts/Getter";
import Setter from "../contracts/Setter";

export default interface ModelSerializer<MODEL /* extends Model */> extends Injectable {

  getAttributeValues<M extends MODEL>(model: M, getter: Getter<M>): Dict<any>;
  setAttributeValues<M extends MODEL>(model: M, attributes: Dict<any>, setter: Setter<M>): void;

  getIdentity(model: MODEL): RecordIdentity;

  getId<M extends MODEL>(model: M, getter: Getter<M>): string;
  setId<M extends MODEL>(model: M, value: string, setter: Setter<M>);

}
