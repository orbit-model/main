import { Dict } from '@orbit/utils';

export default interface RecordSerializer<RECORD> {

  getType(record: RECORD): string;

  getID(record: RECORD): string;

  getRemoteId(record: RECORD): string;

  getAttributeValues(record: RECORD): Dict<any>;

}
