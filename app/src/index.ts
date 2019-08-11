import Memory from '@orbit/memory';
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

  const memory = new Memory({ schema, keyMap });

  ApplicationBranch.setup(memory);
  let workBranch0: Branch = await ApplicationBranch.fork();

  await prefillMemorySource(memory);

  try {
    let model = await workBranch0.query().select(Planet).find("1");
    console.log('model', model);
    console.log('JSON', JSON.stringify(model));
  } catch (e) {
    console.log('no model found: ', e.message)
  }
  //console.log("root: ", memory.name, memory.cache.getRecordsSync("planet"));
  //console.log("work: ", workBranch0.getMemorySource().name, workBranch0.getMemorySource().cache.getRecordsSync("planet"));
})();

async function prefillMemorySource(memory: Memory) {
  await add(memory, {
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

async function add(memory: Memory, record: Record) {
  let keyMap = memory.cache.keyMap;
  keyMap.pushRecord(record);
  await memory.update(t => t.addRecord(record));
}

function waitFor(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
