import ModelSerializer from "../ModelSerializer";
import { RecordIdentity, Record } from "@orbit/data";
import Memory from "@orbit/memory";
import { dasherize } from "@orbit/utils";
import { Container } from "@orbit-model/di";
import { ModelMetaAccessor } from "@orbit-model/meta";
import { Adapter, Model, OrbitModelMeta, RelationshipAdapter } from "@orbit-model/contracts";

export default class DefaultRelationshipAdapter implements RelationshipAdapter {
  private di: Container | null = null;

  _setOrbitDi(di: Container): void {
    this.di = di;
  }

  private getModelSerializer(): ModelSerializer {
    if (this.di === null) {
      throw new Error("the DefaultRelationshipAdapter has to be instantiated through a DI container");
    }
    return this.di.get("system", "ModelSerializer");
  }

  private getAdapter(): Adapter {
    if (this.di === null) {
      throw new Error("the DefaultRelationshipAdapter has to be instantiated through a DI container");
    }
    return this.di.get<Adapter>("system", "Adapter");
  }

  private static getNameFromType<M extends Model>(model: M): string {
    return dasherize(model.constructor.name)
  }

  private getMemorySource(model: Model): Memory {
    return this.getMeta(model).branch.getMemorySource();
  }

  private getMeta(model: Model): OrbitModelMeta {
    if (this.di === null) {
      throw new Error("the DefaultAdapter has to be instantiated through a DI container");
    }
    let meta = ModelMetaAccessor.getMeta(model);
    if (meta === undefined) {
      throw new Error("Model meta data has not been initialized yet!");
    }
    return meta;
  }


//## to one #########################################################
  async getRelatedModel<T extends Model, R extends Model>(model: T, relationship: string): Promise<R> {
    let memorySource: Memory = this.getMemorySource(model);
    let modelSerializer = this.getModelSerializer();
    let recordIdentity = modelSerializer.getIdentity(model);
    let record = await memorySource.query(q => q.findRelatedRecord(recordIdentity, relationship));

    let adapter = this.getAdapter();
    let branch = this.getMeta(model).branch;
    return adapter.createFromRecord<R>(record, branch);
  }

  setRelatedModel<T extends Model, R extends Model>(model: T, value: R, relationship?: string): Promise<void> {
    let memorySource: Memory = this.getMemorySource(model);
    let modelSerializer = this.getModelSerializer();
    let relName = relationship || DefaultRelationshipAdapter.getNameFromType(value);

    return memorySource.update(
      t => t.replaceRelatedRecord(
        modelSerializer.getIdentity(model),
        relName,
        modelSerializer.getIdentity(value)
      )
    );
  }

//## to many ########################################################
  async getAllRelatedModels<T extends Model, R extends Model>(model: T, relationship: string): Promise<R[]> {
    console.log("model:", model, "relationship: ", relationship);
    let memorySource: Memory = this.getMemorySource(model);
    let modelSerializer = this.getModelSerializer();
    let recordIdentity = modelSerializer.getIdentity(model);
    let records: Record[] = await memorySource.query(q => q.findRelatedRecords(recordIdentity, relationship));

    let adapter = this.getAdapter();
    let branch = this.getMeta(model).branch;
    return records.map(record => adapter.createFromRecord<R>(record, branch))
  }

  addRelatedModel<T extends Model, R extends Model>(model: T, value: R, relationship?: string): Promise<void> {
    let memorySource = this.getMemorySource(model);
    let modelSerializer = this.getModelSerializer();
    let relName = relationship || DefaultRelationshipAdapter.getNameFromType(value);

    return memorySource.update(
      t => t.addToRelatedRecords(
        modelSerializer.getIdentity(model),
        relName,
        modelSerializer.getIdentity(value)
      )
    );
  }

  removeRelatedModel<T extends Model, R extends Model>(model: T, value: R, relationship?: string): Promise<void> {
    let memorySource = this.getMemorySource(model);
    let modelSerializer = this.getModelSerializer();
    let relName = relationship || DefaultRelationshipAdapter.getNameFromType(value);

    return memorySource.update(
      t => t.removeFromRelatedRecords(
        modelSerializer.getIdentity(model),
        relName,
        modelSerializer.getIdentity(value)
      )
    );
  }

  replaceRelatedModels<T extends Model, R extends Model>(model: T, value: R[], relationship?: string): Promise<void> {
    let memorySource = this.getMemorySource(model);
    let modelSerializer = this.getModelSerializer();
    let relName = relationship || DefaultRelationshipAdapter.getNameFromType(value[0]);

    return memorySource.update(
      t => t.replaceRelatedRecords(
        modelSerializer.getIdentity(model),
        relName,
        value.map(val => modelSerializer.getIdentity(val))
      )
    );
  }

  async syncRelatedModels<T extends Model, R extends Model>(model: T, value: R[], relationship?: string): Promise<void> {
    // todo: look at method performance
    let memorySource: Memory = this.getMemorySource(model);
    let modelSerializer = this.getModelSerializer();
    let recordIdentity = modelSerializer.getIdentity(model);
    let relName = relationship || DefaultRelationshipAdapter.getNameFromType(value[0]);

    let current: RecordIdentity[] = await memorySource.query(q => q.findRelatedRecords(recordIdentity, relName));

    let valueIds: RecordIdentity[] = value.map(modelSerializer.getIdentity);

    // add all models not in relationship
    await Promise.all(valueIds.map(async (val) => {
      if (current.find(curr => curr.id == val.id) === undefined) {
        await memorySource.update(
          t => t.addToRelatedRecords(
            recordIdentity,
            relName,
            val
          )
        );
      }
    }));
    // remove models from relationship not in given model array
    await Promise.all(current.map(async (curr) => {
      if (valueIds.find(val => curr.id == val.id) === undefined) {
        await memorySource.update(
          t => t.removeFromRelatedRecords(
            recordIdentity,
            relName,
            curr
          )
        );
      }
    }));
  }

}
