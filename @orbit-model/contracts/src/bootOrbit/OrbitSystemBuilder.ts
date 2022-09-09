import {MemorySource, MemorySourceSettings} from "@orbit/memory";
import {OrbitKlass} from "./OrbitFactorySources";
import {Source, SourceSettings} from "@orbit/data";

export default interface OrbitSystemBuilder {

  primaryMemorySource(sourceBuilder: SourceBuilderFN<MemorySource, MemorySourceSettings>): void;



}

export interface SourceBuilderFN<SOURCE extends Source, SETTINGS extends SourceSettings> {
  (source: SourceBuilder<SOURCE, SETTINGS>): void
}

export interface SourceBuilder<
  SOURCE extends Source,
  SOURCE_SETTINGS extends SourceSettings,
  > {

  klass<S extends SOURCE, T extends SOURCE_SETTINGS>(klass: OrbitKlass<S, T>): SourceBuilder<SOURCE, SOURCE_SETTINGS>

  name(name: string): SourceBuilder<SOURCE, SOURCE_SETTINGS>

  bucket(bucketBuilder: BucketBuilderFN<any, any>)
}

export interface BucketBuilderFN<SOURCE extends Source, SETTINGS extends SourceSettings> {
  (source: SourceBuilder<SOURCE, SETTINGS>): void
}
