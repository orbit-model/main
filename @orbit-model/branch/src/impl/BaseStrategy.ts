import { ConnectionStrategy, ConnectionStrategyOptions } from "@orbit/coordinator";
import Orbit, { Listener } from "@orbit/core";
import Memory from "@orbit/memory";

export default class BaseStrategy extends ConnectionStrategy {
  constructor(options: ConnectionStrategyOptions) {
    options.blocking = true;
    super(options);
  }

  protected generateListener(): Listener {
    const source = this.source as Memory;
    let superListener = super.generateListener().bind(this);

    return (...args: any[]): Promise<void> => {
      let result = superListener(...args);
      Orbit.assert("blocking is always true", this._blocking === true);
      Orbit.assert("query result is a promise", !!result && !!result.then);
      result.then(() => {
        source.rebase();
      });
      return result;
    };
  }
}
