import { ModelClass, SetupUpdater, SourceWithBucketBuilderFN } from "@orbit-model/contracts";
import { Bucket, BucketSettings } from "@orbit/core";
import { Source, SourceSettings } from "@orbit/data";
import RootBranch from "@orbit-model/contracts/dist/RootBranch";
import { Coordinator } from "@orbit/coordinator";

export default class OrbitModelSetupUpdater implements SetupUpdater {
  private readonly localBackupSource: Source;
  private readonly localBackupBucket: Bucket<BucketSettings>;
  private readonly localBackupCoordinator: Coordinator;
  private readonly rootBranch: RootBranch;

  constructor(
    localBackupSource: Source,
    localBackupBucket: Bucket<BucketSettings>,
    localBackupCoordinator: Coordinator,
    rootBranch: RootBranch
  ) {
    this.localBackupSource = localBackupSource;
    this.localBackupBucket = localBackupBucket;
    this.localBackupCoordinator = localBackupCoordinator;
    this.rootBranch = rootBranch;
  }

  getLocalBackupSource<S extends Source>(): S {
    return this.localBackupSource as S;
  }

  getLocalBackupBucket<BS extends BucketSettings, B extends Bucket<BS>>(): B {
    return this.localBackupBucket as B;
  }

  getLocalBackupCoordinator(): Coordinator {
    return this.localBackupCoordinator;
  }

  getRootBranch(): RootBranch {
    return this.rootBranch;
  }

  model(model: ModelClass): SetupUpdater {
    // todo: implement
    return this;
  }

  remoteSource(
    sourceBuilder: SourceWithBucketBuilderFN<SourceSettings, Source, BucketSettings, Bucket<BucketSettings>>
  ): SetupUpdater {
    // todo: implement
    return this;
  }

  async settle(): Promise<SetupUpdater> {
    // todo: implement
    return this;
  }
}
