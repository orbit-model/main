import { createFacadeFor } from "@orbit-model/di";
import { ModelMetaAccessor as iModelMetaAccessor } from "@orbit-model/core";

export const ModelMetaAccessor = createFacadeFor("system", "ModelMetaAccessor") as iModelMetaAccessor;
