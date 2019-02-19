//import 'reflect-metadata';
import Store from '@orbit/store';
import Planet from "./Planet";
import { KeyMap } from "@orbit/data";
import ApplicationBranch, { Branch } from "@orbit-model/branching";
import ApplicationDI, { Container } from "@orbit-model/di";
import { Model, SchemaBuilder } from "@orbit-model/model";

(async function main() {
  const di: Container = ApplicationDI.getDI();

  const schema = di.get<SchemaBuilder>('system', 'schemaBuilder').createSchema();
  const keyMap = new KeyMap();

  const store = new Store({ schema, keyMap });

  ApplicationBranch.setup(store);

  let workBranch0: Branch<Model> = ApplicationBranch.fork();

  try {
    let model = await workBranch0.query().select(Planet).find("1");
    console.log('model', model);
  } catch (e) {
    console.log('no model found: ', e.message)
  }
})();
