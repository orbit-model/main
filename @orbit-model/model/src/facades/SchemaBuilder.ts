import { createFacadeFor } from "@orbit-model/di";
import { SchemaBuilder as iSchemaBuilder } from "@orbit-model/contracts";

export const SchemaBuilder = createFacadeFor<iSchemaBuilder>("system", "SchemaBuilder");
