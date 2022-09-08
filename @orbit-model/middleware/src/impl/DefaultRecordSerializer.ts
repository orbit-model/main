import RecordSerializer from "@orbit-model/contracts/dist/middelware/RecordSerializer";
import { Record } from "@orbit/records";
import { Dict } from "@orbit/utils";

export default class DefaultRecordSerializer implements RecordSerializer {
  getAttributeValues(record: Record): Dict<any> {
    return record.attributes || {};
  }

  getID(record: Record): string {
    return record.id;
  }

  getRemoteId(record: Record): string | undefined {
    if (record.keys === undefined) {
      return undefined;
    }
    return record.keys.remoteId;
  }

  getType(record: Record): string {
    return record.type;
  }
}
