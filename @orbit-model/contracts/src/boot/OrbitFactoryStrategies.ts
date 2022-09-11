import MemorySource from "@orbit/memory";
import { Bucket } from "@orbit/core";
import { Source } from "@orbit/data";
import OrbitSystem from "./OrbitSystem";
import { Strategy, StrategyOptions } from "@orbit/coordinator";

/**
 * @deprecated
 */
export default interface OrbitFactoryStrategies {
  getBucket(): Bucket;

  getMemorySource(): MemorySource;

  getBackupSource(): Source;

  getRemoteSourceKeys(): string[];

  getRemoteSource(key: string): Source;

  clearCoordinationStrategies(): void;

  /**
   *
   * @return string An ID/key which identifies the coordinator strategy for later use (in orbit system stage of the factory).
   */
  addCoordinationStrategie<STRATEGY extends Strategy, SETTINGS extends StrategyOptions>(
    klass: { new (arg?: SETTINGS): STRATEGY },
    settings?: SETTINGS
  ): string;

  bootOrbit(): Promise<OrbitSystem>;
}
