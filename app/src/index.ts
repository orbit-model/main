import Memory from '@orbit/memory';
import Planet from "./Planet";
import { KeyMap, Record } from "@orbit/data";
import ApplicationBranch from "@orbit-model/branch";
import { Branch } from "@orbit-model/core";
import "@orbit-model/middleware";
import { SchemaBuilder } from "@orbit-model/bootstrap";

(async function main() {
  let schema = SchemaBuilder.createSchema();
  let keyMap = new KeyMap();

  let memory = new Memory({ schema, keyMap });

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
