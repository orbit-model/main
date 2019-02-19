import RecordSerializer from "../RecordSerializer";
import { Record } from '@orbit/data';
import { Dict } from "@orbit/utils";
import ApplicationDI from "@orbit-model/di";


export default class DefaultRecordSerializer implements RecordSerializer {

  getAttributeValues(record: Record): Dict<any> {
    return record.attributes || {};
  }

  getID(record: Record): string {
    return record.id;
  }

  getRemoteId(record: Record): string {
    if (record.keys === undefined) {
      throw new Error("Your store is probably setup with the wrong schema: " +
        "the given record must contain a keys object with a remoteId property");
    }
    return record.keys.remoteId;
  }

  getType(record: Record): string {
    return record.type;
  }

}

ApplicationDI.getDI().register('middleware', 'recordSerializer', DefaultRecordSerializer, { singleton: true });
