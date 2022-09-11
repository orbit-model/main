import { Bucket, BucketSettings } from "@orbit/core";

export interface BucketFactory<SETTINGS extends BucketSettings, SOURCE extends Bucket<SETTINGS>> {
  (defaultSettings: SETTINGS): SOURCE;
}
