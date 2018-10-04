import Adapter from "../../contracts/Adapter";
import RelationshipAdapter from "../../contracts/RelationshipAdapter";
import ModelSerializer from "./ModelSerializer";
import RecordSerializer from "./RecordSerializer";
import AdapterService from "./AdapterService";
import Injectable from "../../contracts/Injectable";

export default interface MiddlewareRegistry<H, M> {

  // getAdapter(): Adapter<MODEL>;
  // setAdapter(adapter: Adapter<MODEL>);
  //
  // getRelationshipAdapter(): RelationshipAdapter<MODEL>;
  // setRelationshipAdapter(adapter: RelationshipAdapter<MODEL>);
  //
  // getModelSerializer(): ModelSerializer<H, MODEL>;
  // setModelSerializer(serializer: ModelSerializer<H, MODEL>);
  //
  // getRecordSerializer(): RecordSerializer;
  // setRecordSerializer(serializer: RecordSerializer);


  getServices(): Array<AdapterService<M>>;
  runHooks<O>(hookName: string, args: O);

}
