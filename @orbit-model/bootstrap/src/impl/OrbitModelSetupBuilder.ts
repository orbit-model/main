import {
  SchemaBuilder,
  SetupBuilder,
  SetupUpdater,
  SourceBuilderFN,
  SourceWithBucketBuilderFN
} from "@orbit-model/contracts";
import {Source, SourceSettings} from "@orbit/data";
import Orbit, {Bucket, BucketSettings} from "@orbit/core";
import {MemorySource, MemorySourceSettings} from "@orbit/memory";
import OrbitModelSetupUpdater from "./OrbitModelSetupUpdater";
import OrbitModelSourceBuilder from "./OrbitModelSourceBuilder";
import {AppDI, Container} from "@orbit-model/di";


export default class OrbitModelSetupBuilder implements SetupBuilder {

  private _di: Container;
  private _built: boolean = false;

  private _schemaBuilder?: SchemaBuilder;
  private _primaryMemorySourceBuilder?: OrbitModelSourceBuilder<MemorySourceSettings, MemorySource>;


  constructor(di?: Container) {
    this._di = di || AppDI.getDI();
  }

  build(): SetupUpdater {
    this._built = true;

    let schemaBuilder: SchemaBuilder = this._di.get("system", "SchemaBuilder")
    let primaryMemorySource = this._buildMemorySource(schemaBuilder)

    return new OrbitModelSetupUpdater(primaryMemorySource,);
  }

  localBackupSource(sourceBuilder: SourceWithBucketBuilderFN<SourceSettings, Source, BucketSettings, Bucket<BucketSettings>>): SetupBuilder {
    Orbit.assert("Don't reuse the setup builder object", !this._built)

    return this;
  }

  primaryMemorySource(sourceBuilder: SourceBuilderFN<MemorySourceSettings, MemorySource, {}, Bucket<any>>): SetupBuilder {
    Orbit.assert("Don't reuse the setup builder object", !this._built)

    let builder = new OrbitModelSourceBuilder();
    sourceBuilder(builder)
    this._primaryMemorySourceBuilder = builder

    return this;
  }

  private _buildMemorySource(schemaBuilder: SchemaBuilder): MemorySource {
    return new MemorySource({
      schema: schemaBuilder.createSchema()
    })
  }

}
