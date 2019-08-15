import { SchemaBuilder } from "@orbit-model/bootstrap";
import Memory from '@orbit/memory';
import Planet from "./Planet";
import './SolarSystem';
import { KeyMap, Record } from "@orbit/data";
import ApplicationBranch from "@orbit-model/branch";
import { Branch } from "@orbit-model/core";
import { demoData } from "./demoData";

// fail on unhandled promise exceptions
process.on('unhandledRejection', up => { throw up });

(async function main() {
  let schema = SchemaBuilder.createSchema();
  let keyMap = new KeyMap();

  let memory = new Memory({ schema, keyMap });

  ApplicationBranch.setup(memory);
  let workBranch: Branch = await ApplicationBranch.fork();

  await demoData(memory);

  let model = await workBranch.query().select(Planet).find("1");
  console.log('model', model);
  console.log('JSON', JSON.stringify(model));
})();


function waitFor(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
