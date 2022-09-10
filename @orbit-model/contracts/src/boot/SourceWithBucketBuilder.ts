import {Source, SourceSettings} from "@orbit/data";
import {Bucket, BucketSettings} from "@orbit/core";
import {OrbitKlass} from "./OrbitFactorySources";
import SourceBuilder from "./SourceBuilder";
import {BucketBuilderFN} from "./BucketBuilder";

export default interface SourceWithBucketBuilder<SOURCE_SETTINGS extends SourceSettings,
  SOURCE extends Source,
  BUCKET_SETTINGS extends BucketSettings,
  BUCKET extends Bucket<BUCKET_SETTINGS>> extends SourceBuilder<SOURCE_SETTINGS, SOURCE> {

  klass<SS extends SOURCE_SETTINGS, S extends SOURCE>(klass: OrbitKlass<S, SS>): SourceWithBucketBuilder<SOURCE_SETTINGS, SOURCE, BUCKET_SETTINGS, BUCKET>

  name(name: string): SourceWithBucketBuilder<SOURCE_SETTINGS, SOURCE, BUCKET_SETTINGS, BUCKET>

  bucket(bucketBuilder: BucketBuilderFN<BUCKET_SETTINGS, BUCKET>): void
}

export interface SourceWithBucketBuilderFN<SETTINGS extends SourceSettings,
  SOURCE extends Source,
  BUCKET_SETTINGS extends BucketSettings,
  BUCKET extends Bucket<BUCKET_SETTINGS>> {
  (source: SourceWithBucketBuilder<SETTINGS, SOURCE, BUCKET_SETTINGS, BUCKET>): void
}
