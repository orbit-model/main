import App from "../App";

export default function createFacadeFor(namespace: string, name: string) {
  return new Proxy({}, {
    get(target: {}, p: string | number | symbol, receiver: any): any {
      let instance: any = App.getDI().get(namespace, name);
      return instance[p];
    }
  })
}
