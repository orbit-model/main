import MiddlewareRegistryContract, { ServiceType } from "../MiddlewareRegistry";
import Model from "../../contracts/Model";
import AdapterService from "../AdapterService";
import ModelSerializerService from "../ModelSerializerService";

export default class MiddlewareRegistry implements MiddlewareRegistryContract<Model> {

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

  getModelSerializerServices(): Array<ModelSerializerService<Model>> {
    return this.getServices(ServiceType.ModelSerializer);
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
