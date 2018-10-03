import Adapter from "../../contracts/Adapter";
import RelationshipAdapter from "../../contracts/RelationshipAdapter";
import ModelSerializer from "./ModelSerializer";
import RecordSerializer from "./RecordSerializer";
import AdapterService from "./AdapterService";

export default interface MiddlewareRegistry<H, M> {

  getAdapter(): Adapter<M>;
  setAdapter(adapter: Adapter<M>);

  getRelationshipAdapter(): RelationshipAdapter;
  setRelationshipAdapter(adapter: RelationshipAdapter);

  getModelSerializer(): ModelSerializer<H, M>;
  setModelSerializer(serializer: ModelSerializer<H, M>);

  getRecordSerializer(): RecordSerializer;
  setRecordSerializer(serializer: RecordSerializer);


  getServices(): Array<AdapterService<M>>;

}
