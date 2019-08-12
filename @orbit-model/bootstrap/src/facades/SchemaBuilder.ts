import createFacadeFor from "./proxy/createFacadeFor";
import { SchemaBuilder as iSchemaBuilder } from "@orbit-model/model";

export const SchemaBuilder = createFacadeFor('system', 'schemaBuilder') as iSchemaBuilder;
