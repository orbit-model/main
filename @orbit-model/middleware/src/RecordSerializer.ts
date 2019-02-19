import { Record } from "@orbit/data";
import { Dict } from '@orbit/utils';


export default interface RecordSerializer {

  getType(record: Record): string;

  getID(record: Record): string;

  getRemoteId(record: Record): string;

  getAttributeValues(record: Record): Dict<any>;

}
