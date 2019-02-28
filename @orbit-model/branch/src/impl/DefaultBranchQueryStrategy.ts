import { ConnectionStrategy } from "@orbit/coordinator";
import Orbit, { Listener } from "@orbit/core";
import Store from "@orbit/store";

export interface DefaultBranchQueryStrategyOptions {
  /**
   * The name of the source to be observed.
   */
  source: string;

  /**
   * The name of the source which will be acted upon.
   */
  target: string;

  /**
   * A handler for any errors thrown as a result of performing the action.
   */
  catch?: Function;
}

export default class DefaultBranchQueryStrategy extends ConnectionStrategy {


  constructor(options: DefaultBranchQueryStrategyOptions) {
    super({
      source: options.source,
      target: options.target,
      catch: options.catch,
      on: "beforeQuery",
      action: "query",
      blocking: true
    });
  }

  protected generateListener(): Listener {
    const target = this.target as Store;

    return (data: any, hints: any): any => {
      let result;

      if (this._filter) {
        if (!this._filter(data, hints)) {
          return;
        }
      }

      Orbit.assert("action is always query", this._action === "query");
      result = target.query(data);

      if (this._catch && result && result.catch) {
        result = result.catch((e: Error) => {
          return this._catch(e, data);
        });
      }

      Orbit.assert("query result is a promise", !!result && !!result.then);
      result.then(() => {
        (this.source as Store).rebase()
      });

      Orbit.assert("blocking is always true", this._blocking === true);
      return result;
    };
  }

}
