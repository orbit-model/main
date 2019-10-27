import { createFacadeFor } from "@orbit-model/di";
import { RecordSerializer as iRecordSerializer } from "@orbit-model/contracts";

export const RecordSerializer = createFacadeFor<iRecordSerializer>("system", "RecordSerializer");
