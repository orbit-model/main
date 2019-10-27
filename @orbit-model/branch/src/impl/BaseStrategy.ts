import { ConnectionStrategy, ConnectionStrategyOptions } from "@orbit/coordinator";
import Orbit, { Listener } from "@orbit/core";

export interface BaseStrategyOptions extends ConnectionStrategyOptions {
  /**
   * a function, which will be executed in the context of BaseStrategy
   * after the promise returned form the generated listener has returned
   */
  afterListenerResult?: (this: BaseStrategy) => void;
}

export default class BaseStrategy extends ConnectionStrategy {
  private readonly afterListenerResult: undefined | (() => void);

  constructor(options: BaseStrategyOptions) {
    options.blocking = true;
    super(options);

    if (typeof options.afterListenerResult === "function") {
      this.afterListenerResult = options.afterListenerResult;
    }
  }

  protected generateListener(): Listener {
    let superListener = super.generateListener();

    return (...args: any[]): Promise<void> => {
      let result = superListener(...args);
      Orbit.assert("blocking is always true", this._blocking === true);
      Orbit.assert("query result is a promise", !!result && !!result.then);
      result.then(() => {
        if (typeof this.afterListenerResult === "function") {
          this.afterListenerResult.bind(this)();
        }
      });
      return result;
    };
  }

  async deactivate(): Promise<void> {
    await super.deactivate();
    for (let source of this._sources) {
      await source.activate();
    }
  }
}
