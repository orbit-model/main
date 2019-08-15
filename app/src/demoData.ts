import Memory from '@orbit/memory';
import { Record } from "@orbit/data";

export async function demoData(memory: Memory) {
  await add(memory, {
    type: "planet",
    id: "1208ed04-1f8b-4197-9f4f-100000000000",
    keys: {
      remoteId: "1",
    },
    attributes: {
      name: "earth"
    }
  });
  await add(memory, {
    type: "planet",
    id: "1208ed04-1f8b-4197-9f4f-100000000001",
    keys: {
      remoteId: "2",
    },
    attributes: {
      name: "earth"
    }
  });
  await add(memory, {
    type: "solarSystem",
    id: "1208ed04-1f8b-4197-9f4f-000000000000",
    keys: {
      remoteId: "1",
    },
    attributes: {
      name: "earth"
    },
    relationships: {
      planets: {
        data: [
          {
            type: "planet",
            id: "1208ed04-1f8b-4197-9f4f-000000000000"
          },
          {
            type: "planet",
            id: "1208ed04-1f8b-4197-9f4f-100000000001"
          }
        ]
      } // end of "planets"
    }
  });
}

async function add(memory: Memory, record: Record) {
  let keyMap = memory.cache.keyMap;
  keyMap.pushRecord(record);
  await memory.update(t => t.addRecord(record));
}
