import { createFacadeFor } from "@orbit-model/di";
import { RelationshipAdapter as iRelationshipAdapter } from "@orbit-model/contracts";

export const RelationshipAdapter = createFacadeFor("system", "RelationshipAdapter") as iRelationshipAdapter;
