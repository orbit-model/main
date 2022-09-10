import {MemorySource} from "@orbit/memory";
import {Bucket} from "@orbit/core";
import {Source} from "@orbit/data";
import Coordinator from "@orbit/coordinator";

export default interface OrbitSystem {
  getMemorySource(): MemorySource;

  getBucket(): Bucket;

  getBackupSource(): Source;

  getRemoteSource(key?: string): Source;

  getCoordinator(): Coordinator;
}
