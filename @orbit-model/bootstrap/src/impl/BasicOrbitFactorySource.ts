import { OrbitFactorySources, OrbitFactoryStrategies, OrbitKlass } from "@orbit-model/contracts";
import { Source, SourceSettings } from "@orbit/data";
import { Bucket, BucketSettings } from "@orbit/core";
import MemorySource, { MemorySourceSettings } from "@orbit/memory";

class KlassSettingsPair<INSTANCE, SETTINGS> {
  readonly klass: OrbitKlass<INSTANCE, SETTINGS>;
  readonly settings: SETTINGS | undefined;

  constructor(klass: OrbitKlass<INSTANCE, SETTINGS>, settings: SETTINGS | undefined) {
    this.klass = klass;
    this.settings = settings;
  }
}

export default class BasicOrbitFactorySource implements OrbitFactorySources {
  private bucket: KlassSettingsPair<Bucket, BucketSettings> | null = null;

  setBucket<BUCKET extends Bucket, SETTINGS extends BucketSettings>(
    klass: OrbitKlass<BUCKET, SETTINGS>,
    settings?: SETTINGS
  ): void {
    this.bucket = new KlassSettingsPair<Bucket, BucketSettings>(
      klass as { new (arg?: BucketSettings): Bucket },
      settings
    );
  }

  setMemorySource<SOURCE extends MemorySource, SETTINGS extends MemorySourceSettings>(
    klass: OrbitKlass<SOURCE, SETTINGS>,
    settings?: SETTINGS
  ): void {
    // todo: implement
  }

  setBackupSource<SOURCE extends Source, SETTINGS extends SourceSettings>(
    klass: OrbitKlass<SOURCE, SETTINGS>,
    settings?: SETTINGS
  ): void {
    // todo: implement
  }

  addRemoteSource<SOURCE extends Source, SETTINGS extends SourceSettings>(
    klass: OrbitKlass<SOURCE, SETTINGS>,
    settings?: SETTINGS
  ): string {
    return "";
  }

  clearRemoteSources(): void {
    // todo: implement
  }

  createOrbit(): OrbitFactoryStrategies {
    throw new Error("not implemented");
    // return undefined;
  }
}
