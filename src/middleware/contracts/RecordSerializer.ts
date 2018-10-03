import { Record, RecordIdentity } from '@orbit/data';
import { Dict } from '@orbit/utils';

export default interface RecordSerializer {
  getAttributeValues: (record: Record) => Dict<any>;
  getIdentity: (record: Record) => RecordIdentity;

  // ...
}
