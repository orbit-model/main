import MiddlewareRegistryContract from "./contracts/MiddlewareRegistry";
import Model from "../contracts/Model";
import HiddenOrbitProp from "../contracts/HiddenOrbitProp";
import Adapter from "../contracts/Adapter";
import ModelSerializer from "./contracts/ModelSerializer";
import RelationshipAdapter from "../contracts/RelationshipAdapter";
import AdapterService from "./contracts/AdapterService";
import RecordSerializer from "./contracts/RecordSerializer";

export default class MiddlewareRegistry implements MiddlewareRegistryContract<HiddenOrbitProp, Model> {

  private adapter: Adapter<Model> = null;
  private relationshipAdapter: RelationshipAdapter<Model> = null;
  private modelSerializer: ModelSerializer<HiddenOrbitProp, Model> = null;
  private recordSerializer: RecordSerializer = null;
  private services: Array<AdapterService<Model>> = [];


  getAdapter(): Adapter<Model> {
    return this.adapter;
  }

  getModelSerializer(): ModelSerializer<HiddenOrbitProp, Model> {
    return this.modelSerializer;
  }

  getRecordSerializer(): RecordSerializer {
    return this.recordSerializer;
  }

  getRelationshipAdapter(): RelationshipAdapter<Model> {
    return this.relationshipAdapter;
  }

  getServices(): Array<AdapterService<Model>> {
    return this.services;
  }

  setAdapter(adapter: Adapter<Model>) {
    this.adapter = adapter;
  }

  setModelSerializer(serializer: ModelSerializer<HiddenOrbitProp, Model>) {
    this.modelSerializer = serializer;
  }

  setRecordSerializer(serializer: RecordSerializer) {
    this.recordSerializer = serializer;
  }

  setRelationshipAdapter(adapter: RelationshipAdapter<Model>) {
    this.relationshipAdapter = adapter;
  }

  runHooks<O>(hookName: string, options: O) {
    this.services.forEach((service) => {
      if (typeof service[hookName] === 'function') {
        service[hookName](options);
      }
    })
  }


}
