import { createFacadeFor } from "@orbit-model/di";
import {SchemaBuilder as iSchemaBuilder } from "../../../contracts";

export const SchemaBuilder = createFacadeFor('system', 'SchemaBuilder') as iSchemaBuilder;
