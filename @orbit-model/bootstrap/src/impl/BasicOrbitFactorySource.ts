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

type SingleArgClass<INSTANCE, SETTINGS> = { new (arg?: SETTINGS): INSTANCE };

export default class BasicOrbitFactorySource implements OrbitFactorySources {
  private bucket: KlassSettingsPair<Bucket, BucketSettings> | null = null;
  private memorySource: KlassSettingsPair<MemorySource, MemorySourceSettings> | null = null;
  private backupSource: KlassSettingsPair<Source, SourceSettings> | null = null;
  private remoteSource: KlassSettingsPair<Source, SourceSettings>[] = [];

  setBucket<BUCKET extends Bucket, SETTINGS extends BucketSettings>(
    klass: OrbitKlass<BUCKET, SETTINGS>,
    settings?: SETTINGS
  ): void {
    this.bucket = new KlassSettingsPair<Bucket, BucketSettings>(
      klass as SingleArgClass<Bucket, BucketSettings>,
      settings
    );
  }

  setMemorySource<SOURCE extends MemorySource, SETTINGS extends MemorySourceSettings>(
    klass: OrbitKlass<SOURCE, SETTINGS>,
    settings?: SETTINGS
  ): void {
    this.memorySource = new KlassSettingsPair<MemorySource, MemorySourceSettings>(
      klass as SingleArgClass<MemorySource, MemorySourceSettings>,
      settings
    );
  }

  setBackupSource<SOURCE extends Source, SETTINGS extends SourceSettings>(
    klass: OrbitKlass<SOURCE, SETTINGS>,
    settings?: SETTINGS
  ): void {
    this.backupSource = new KlassSettingsPair<Source, SourceSettings>(
      klass as SingleArgClass<Source, SourceSettings>,
      settings
    );
  }

  addRemoteSource<SOURCE extends Source, SETTINGS extends SourceSettings>(
    klass: OrbitKlass<SOURCE, SETTINGS>,
    settings?: SETTINGS
  ): string {
    return (
      "" +
      this.remoteSource.push(
        new KlassSettingsPair<Source, SourceSettings>(klass as SingleArgClass<Source, SourceSettings>, settings)
      )
    );
  }

  clearRemoteSources(): void {
    this.remoteSource = [];
  }

  createOrbit(): OrbitFactoryStrategies {
    // todo: implement
    throw new Error("not implemented");
  }
}
