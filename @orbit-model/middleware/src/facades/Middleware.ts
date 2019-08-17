import { DI } from "@orbit-model/di";
import { Adapter, RelationshipAdapter } from "@orbit-model/contracts";

export interface iMiddleware extends Adapter, RelationshipAdapter {
}

export const Middleware = new Proxy({}, {
  get(target: {}, p: string | number | symbol, receiver: any): any {
    let adapter: any = DI.get("system", "Adapter");
    if (typeof adapter[p] !== "undefined") {
      return adapter[p];
    }
    let relationshipAdapter: any = DI.get("system", "RelationshipAdapter");
    return relationshipAdapter[p];
  }
}) as iMiddleware;
