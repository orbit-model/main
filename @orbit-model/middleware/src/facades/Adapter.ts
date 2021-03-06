import { createFacadeFor } from "@orbit-model/di";
import { Adapter as iAdapter } from "@orbit-model/contracts";

export const Adapter = createFacadeFor<iAdapter>("system", "Adapter");
