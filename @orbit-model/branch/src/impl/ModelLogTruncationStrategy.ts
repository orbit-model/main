import { LogTruncationStrategy } from "@orbit/coordinator";

export default class ModelLogTruncationStrategy extends LogTruncationStrategy {
  async deactivate(): Promise<void> {
    await super.deactivate();
    for (let source of this._sources) {
      await source.activate();
    }
  }
}
