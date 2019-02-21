//import 'reflect-metadata';
import Store from '@orbit/store';
import Planet from "./Planet";
import { KeyMap } from "@orbit/data";
import ApplicationBranch  from "@orbit-model/branch";
import { Branch } from "@orbit-model/core";
import ApplicationDI, { Container } from "@orbit-model/di";
import { SchemaBuilder } from "@orbit-model/model";

(async function main() {
  const di: Container = ApplicationDI.getDI();

  const schema = di.get<SchemaBuilder>('system', 'schemaBuilder').createSchema();
  const keyMap = new KeyMap();

  const store = new Store({ schema, keyMap });
  prefillStore(store);

  ApplicationBranch.setup(store);

  let workBranch0: Branch = ApplicationBranch.fork();

  try {
    let model = await workBranch0.query().select(Planet).find("1");
    console.log('model', model);
  } catch (e) {
    console.log('no model found: ', e.message)
  }
})();

function prefillStore(store: Store) {
  store.update(t => t.addRecord({
    type: "planet",
    id: "1208ed04-1f8b-4197-9f4f-8ca60c980b1e",
    keys: {
      remoteId: "1",
    },
    attributes: {
      name: "earth"
    }
  }));
}
