import { Record, RecordIdentity } from '@orbit/data';
import { Dict } from '@orbit/utils';
import Injectable from "../contracts/Injectable";

export default interface RecordSerializer extends Injectable {
  getType(record: Record): string;

  getAttributeValues(record: Record): Dict<any>;
  getIdentity(record: Record): RecordIdentity;

  getRemoteId(record: Record): string;

}
