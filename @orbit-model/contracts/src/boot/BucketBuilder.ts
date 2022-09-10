import {Bucket, BucketSettings} from "@orbit/core";
import {OrbitKlass} from "./OrbitFactorySources";

export default interface BucketBuilder<BUCKET_SETTINGS extends BucketSettings = {},
  BUCKET extends Bucket<BUCKET_SETTINGS> = Bucket<BUCKET_SETTINGS>> {

  klass<BS extends BUCKET_SETTINGS, B extends BUCKET>(klass: OrbitKlass<B, BS>): BucketBuilder<BUCKET_SETTINGS, BUCKET>

  name(name: string): BucketBuilder<BUCKET_SETTINGS, BUCKET>

}

export interface BucketBuilderFN<BUCKET_SETTINGS extends BucketSettings = {},
  BUCKET extends Bucket<BUCKET_SETTINGS> = Bucket<BUCKET_SETTINGS>> {
  (source: BucketBuilder<BUCKET_SETTINGS, BUCKET>): void
}

