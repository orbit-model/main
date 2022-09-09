import { Record } from "@orbit/records";
import { Dict } from "@orbit/utils";

export default interface RecordSerializer {
  getType(record: Record): string;

  getID(record: Record): string;

  getRemoteId(record: Record): string | undefined;

  getAttributeValues(record: Record): Dict<any>;
}
