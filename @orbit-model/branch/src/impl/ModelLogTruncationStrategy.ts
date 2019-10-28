import { LogTruncationStrategy } from "@orbit/coordinator";

export default class ModelLogTruncationStrategy extends LogTruncationStrategy {
  async deactivate(): Promise<void> {
    await super.deactivate();
    // todo: remove workaround
    for (let source of this._sources) {
      await source.activate();
    }
  }
}
