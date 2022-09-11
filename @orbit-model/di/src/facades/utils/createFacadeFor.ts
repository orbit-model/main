import { DI } from "../DI";

export default function createFacadeFor<T>(namespace: string, name: string): T {
  return new Proxy(
    {},
    {
      get(target: {}, p: string | number | symbol): any {
        let instance: any = DI.get<T>(namespace, name);
        return instance[p];
      },
    }
  ) as T;
}
