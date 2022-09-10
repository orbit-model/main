import RootBranch from "../RootBranch";
import {Source, SourceSettings} from "@orbit/data";
import {Bucket, BucketSettings} from "@orbit/core";
import {Coordinator} from "@orbit/coordinator";
import ModelClass from "../ModelClass";
import {SourceWithBucketBuilderFN} from "./SourceWithBucketBuilder";

export default interface SetupUpdater {

  getRootBranch(): RootBranch

  getLocalBackupSource<S extends Source>(): S
  getLocalBackupBucket<BS extends BucketSettings, B extends Bucket<BS>>(): B
  getLocalBackupCoordinator(): Coordinator


  model(model: ModelClass): SetupUpdater;

  remoteSource(sourceBuilder: SourceWithBucketBuilderFN<SourceSettings, Source, BucketSettings, Bucket<BucketSettings>>): SetupUpdater;

  settle(): Promise<SetupUpdater>

}
