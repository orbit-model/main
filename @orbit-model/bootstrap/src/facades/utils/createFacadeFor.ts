import { DI } from "@orbit-model/di";

export default function createFacadeFor(namespace: string, name: string) {
  return new Proxy({}, {
    get(target: {}, p: string | number | symbol, receiver: any): any {
      let instance: any = DI.get(namespace, name);
      return instance[p];
    }
  })
}
