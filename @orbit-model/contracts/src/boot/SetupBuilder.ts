import {MemorySource, MemorySourceSettings} from "@orbit/memory";
import {Source, SourceSettings} from "@orbit/data";
import {Bucket, BucketSettings} from "@orbit/core";
import SetupUpdater from "./SetupUpdater";
import {SourceBuilderFN} from "./SourceBuilder";
import {SourceWithBucketBuilderFN} from "./SourceWithBucketBuilder";

export default interface SetupBuilder {

  /**
   * Create/Build a new `MemorySource` instance from the package `@orbit/memory`
   */
  primaryMemorySource(sourceBuilder: SourceBuilderFN<MemorySourceSettings, MemorySource>): SetupBuilder;

  /**
   * Create/Build a new instance of an implementation of `Source` with a `Bucket` for backup storage.
   *
   * This function is usually used to add a Local-Storage-Source (or IndexedDB-Source) for safekeeping of data between
   * browser reloads.
   */
  localBackupSource(sourceBuilder: SourceWithBucketBuilderFN<SourceSettings, Source, BucketSettings, Bucket<BucketSettings>>): SetupBuilder;

  /**
   * Transitions the Orbit and Orbit-Model System into a "running" state
   */
  build(): Promise<SetupUpdater>;
}


