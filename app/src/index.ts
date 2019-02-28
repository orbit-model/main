//import 'reflect-metadata';
import Store from '@orbit/store';
import Planet from "./Planet";
import { KeyMap, Record } from "@orbit/data";
import ApplicationBranch from "@orbit-model/branch";
import { Branch } from "@orbit-model/core";
import ApplicationDI, { Container } from "@orbit-model/di";
import { SchemaBuilder } from "@orbit-model/model";
import "@orbit-model/middleware";

(async function main() {
  const di: Container = ApplicationDI.getDI();

  const schema = di.get<SchemaBuilder>('system', 'schemaBuilder').createSchema();
  const keyMap = new KeyMap();

  const store = new Store({ schema, keyMap });

  ApplicationBranch.setup(store);
  let workBranch0: Branch = await ApplicationBranch.fork();

  console.log("## 1 ###################################################");
  await prefillStore(store);
  //await waitFor(1000);
  console.log("## 2 ###################################################");

  try {
    let promise = workBranch0.query().select(Planet).find("1");
    //await waitFor(1);
    console.log("## 3 ###################################################");
    let model = await promise;
    console.log('model', JSON.stringify(model));
  } catch (e) {
    console.log('no model found: ', e.message)
  }
  //console.log("root: ", store.name, store.cache.getRecordsSync("planet"));
  //console.log("work: ", workBranch0.getStore().name, workBranch0.getStore().cache.getRecordsSync("planet"));
})();

async function prefillStore(store: Store) {
  await add(store, {
    type: "planet",
    id: "1208ed04-1f8b-4197-9f4f-8ca60c980b1e",
    keys: {
      remoteId: "1",
    },
    attributes: {
      name: "earth"
    }
  });
}

async function add(store: Store, record: Record) {
  let keyMap = store.cache.keyMap;
  keyMap.pushRecord(record);
  await store.update(t => t.addRecord(record));
}

function waitFor(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
