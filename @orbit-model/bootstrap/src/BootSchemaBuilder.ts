import { RecordSchema } from "@orbit/records";
import ModelClass from "@orbit-model/contracts/dist/ModelClass";
import { Serializer } from "@orbit/serializers";

export default interface BootSchemaBuilder {
  setSerializer(serializer: Serializer): void;

  /**
   * creates a schema based on the models in the DI
   */
  createSchema(models: ModelClass[]): RecordSchema;
}
