import RootBranch from "@orbit-model/contracts/dist/RootBranch";
import { Source, SourceSettings } from "@orbit/data";
import { Bucket, BucketSettings } from "@orbit/core";
import { Coordinator } from "@orbit/coordinator";
import ModelClass from "@orbit-model/contracts/dist/ModelClass";
import { SourceFactory } from "./SourceFactory";
import { RecordSchema } from "@orbit/records";

export default interface SetupUpdater {
  getRootBranch(): RootBranch;

  getLocalBackupSource<S extends Source>(): S;
  getLocalBackupBucket<BS extends BucketSettings, B extends Bucket<BS>>(): B;
  getLocalBackupCoordinator(): Coordinator;

  getSchemaCurrentSchema(): RecordSchema;

  addModels(...models: ModelClass[]): SetupUpdater;

  addRemoteSource(sourceFactory: SourceFactory<SourceSettings, Source>): SetupUpdater;

  settle(): Promise<SetupUpdater>;
}
