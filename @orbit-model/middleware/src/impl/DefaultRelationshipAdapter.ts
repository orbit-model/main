import ModelSerializer from "../ModelSerializer";
import { RecordIdentity } from "@orbit/data";
import Memory from "@orbit/memory";
import { dasherize } from "@orbit/utils";
import { Model, RelationshipAdapter } from "@orbit-model/core";
import { Container } from "@orbit-model/di";
import { ModelMetaAccessor } from "@orbit-model/meta";

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

  private static getNameFromType<M>(model: M): string {
    // @ts-ignore
    return dasherize(model.constructor.name)
  }

  private getMemorySource(model: Model): Memory {
    if (this.di === null) {
      throw new Error("the DefaultAdapter has to be instantiated through a DI container");
    }
    let meta = ModelMetaAccessor.getMeta(model);
    if (meta === undefined) {
      throw new Error("Model meta data has not been initialized yet!");
    }
    return meta.branch.getMemorySource();
  }


//## to one #########################################################
  getRelatedModel<T extends Model, R extends Model>(model: T, relationship: string): Promise<R> {
    let memorySource: Memory = this.getMemorySource(model);
    let modelSerializer = this.getModelSerializer();
    let recordIdentity = modelSerializer.getIdentity(model);
    return memorySource.query(q => q.findRelatedRecord(recordIdentity, relationship));
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
  getAllRelatedModels<T extends Model, R extends Model>(model: T, relationship: string): Promise<R[]> {
    let memorySource: Memory = this.getMemorySource(model);
    let modelSerializer = this.getModelSerializer();
    let recordIdentity = modelSerializer.getIdentity(model);
    return memorySource.query(q => q.findRelatedRecords(recordIdentity, relationship));
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
    let relName = relationship || DefaultRelationshipAdapter.getNameFromType(value);

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
    let relName = relationship || DefaultRelationshipAdapter.getNameFromType(value);

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
