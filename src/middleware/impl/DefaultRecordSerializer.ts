import RecordSerializer from "../RecordSerializer";
import { Record } from '@orbit/data';
import { Dict } from "@orbit/utils";

export default class DefaultRecordSerializer implements RecordSerializer<Record> {

  getAttributeValues(record: Record): Dict<any> {
    return record.attributes;
  }

  getID(record: Record): string {
    return record.id;
  }

  getRemoteId(record: Record): string {
    return record.keys.remoteId;
  }

  getType(record: Record): string {
    return record.type;
  }


}
