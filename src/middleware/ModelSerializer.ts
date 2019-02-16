import { RecordIdentity } from '@orbit/data';
import { Dict } from '@orbit/utils';
import Injectable from "../di/Injectable";

export default interface ModelSerializer<MODEL /* extends Model */> extends Injectable {

  getAttributeValues<M extends MODEL>(model: M): Dict<any>;
  setAttributeValues<M extends MODEL>(model: M, attributes: Dict<any>): void;

  getIdentity(model: MODEL): RecordIdentity;

}
