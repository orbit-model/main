import { createFacadeFor } from "@orbit-model/di";
import { ModelMetaAccessor as iModelMetaAccessor } from "../../../contracts";

export const ModelMetaAccessor = createFacadeFor<iModelMetaAccessor>("system", "ModelMetaAccessor");
