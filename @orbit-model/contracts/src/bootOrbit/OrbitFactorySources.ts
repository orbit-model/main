import MemorySource, { MemorySourceSettings } from "@orbit/memory";
import { Bucket, BucketSettings } from "@orbit/core";
import OrbitFactoryStrategies from "./OrbitFactoryStrategies";
import { Source, SourceSettings } from "@orbit/data";

export default interface OrbitFactorySources {
  setBucket<BUCKET extends Bucket, SETTINGS extends BucketSettings>(
    klass: { new (arg?: SETTINGS): BUCKET },
    settings?: SETTINGS
  ): void;

  setMemorySource<SOURCE extends MemorySource, SETTINGS extends MemorySourceSettings>(
    klass: { new (arg?: SETTINGS): SOURCE },
    settings?: SETTINGS
  ): void;

  setBackupSource<SOURCE extends Source, SETTINGS extends SourceSettings>(
    klass: { new (arg?: SETTINGS): SOURCE },
    settings?: SETTINGS
  ): void;

  /**
   *
   * @return string An ID/name/key which identifies the remote source for later use (in stage two of the factory).
   */
  addRemoteSource<SOURCE extends Source, SETTINGS extends SourceSettings>(
    klass: { new (arg?: SETTINGS): SOURCE },
    settings?: SETTINGS
  ): string;

  clearRemoteSources(): void;

  createOrbit(): OrbitFactoryStrategies;
}
