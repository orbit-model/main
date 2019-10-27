import { createFacadeFor } from "@orbit-model/di";
import { ModelSerializer as iModelSerializer } from "@orbit-model/contracts";

export const ModelSerializer = createFacadeFor<iModelSerializer>("system", "ModelSerializer");
