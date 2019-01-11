import AdapterService from "./AdapterService";
import ModelSerializerService from "./ModelSerializerService";

export enum ServiceType {
  Adapter,
  RelationshipAdapter,
  ModelSerializer,
  RecordSerializer
}

export default interface MiddlewareRegistry<H, M> {

  getServices(type: ServiceType): Array<any>;

  getAdapterServices(): Array<AdapterService<M>>;

  //getRelationshipAdapterServices(): Array<RelationshipAdapterService<M>>;

  getModelSerializerServices(): Array<ModelSerializerService<M>>;

  //getRecordSerializerServices(): Array<RecordSerializerService<M>>;

  runHook<O>(type: ServiceType, hookName: string, args: O);

  runAsyncHook<O>(type: ServiceType, hookName: string, args: O);

}
