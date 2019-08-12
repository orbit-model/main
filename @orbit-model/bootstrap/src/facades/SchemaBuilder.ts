import { createFacadeFor } from "@orbit-model/di";
import { SchemaBuilder as iSchemaBuilder } from "@orbit-model/model";

export const SchemaBuilder = createFacadeFor('system', 'SchemaBuilder') as iSchemaBuilder;
