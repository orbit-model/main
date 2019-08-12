import { SchemaBuilder } from "@orbit-model/bootstrap";
import Memory from '@orbit/memory';
import Planet from "./Planet";
import { KeyMap, Record } from "@orbit/data";
import ApplicationBranch from "@orbit-model/branch";
import { Branch } from "@orbit-model/core";

// fail on unhandled promise exceptions
process.on('unhandledRejection', up => { throw up });

(async function main() {
  let schema = SchemaBuilder.createSchema();
  let keyMap = new KeyMap();

  let memory = new Memory({ schema, keyMap });

  ApplicationBranch.setup(memory);
  let workBranch0: Branch = await ApplicationBranch.fork();

  await prefillMemorySource(memory);

  let model = await workBranch0.query().select(Planet).find("1");
  console.log('model', model);
  console.log('JSON', JSON.stringify(model));
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
