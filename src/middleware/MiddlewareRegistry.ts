import MiddlewareRegistryContract, { ServiceType } from "./contracts/MiddlewareRegistry";
import Model from "../contracts/Model";
import HiddenOrbitProp from "../contracts/HiddenOrbitProp";
import AdapterService from "./contracts/AdapterService";

export default class MiddlewareRegistry implements MiddlewareRegistryContract<HiddenOrbitProp, Model> {

  private services: Map<ServiceType, Array<any>> = new Map();


  getServices(type: ServiceType): Array<any> {
    let services = this.services.get(type);
    if (!services) {
      services = [];
      this.services.set(type, services);
    }
    return services;
  }

  getAdapterServices(): Array<AdapterService<Model>> {
    return this.getServices(ServiceType.Adapter);
  }


  runHook<O>(type: ServiceType, hookName: string, args: O) {
    this.getServices(type).forEach((service) => {
      if (typeof service[hookName] === 'function') {
        service[hookName](args);
      }
    })
  }

  runAsyncHook<O>(type: ServiceType, hookName: string, args: O): Promise<void> {
    return this.getServices(type).reduce((promise, service) => {
      promise.then(() => {
        if (typeof service[hookName] === 'function') {
          return service[hookName](args);
        }
        return Promise.resolve();
      });
    }, Promise.resolve());
  }
}
