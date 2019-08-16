import Memory from '@orbit/memory';
import { Record } from "@orbit/data";

export async function demoData(memory: Memory) {
  await add(memory, {
    type: "planet",
    id: "1208ed04-1f8b-4197-9f4f-300000000000",
    keys: {
      remoteId: "1",
    },
    attributes: {
      name: "Earth"
    }
  });
  await add(memory, {
    type: "planet",
    id: "1208ed04-1f8b-4197-9f4f-300000000001",
    keys: {
      remoteId: "2",
    },
    attributes: {
      name: "Mercury"
    }
  });
  await add(memory, {
    type: "planet",
    id: "1208ed04-1f8b-4197-9f4f-300000000002",
    keys: {
      remoteId: "3",
    },
    attributes: {
      name: "Saturn"
    }
  });
  await add(memory, {
    type: "planet",
    id: "1208ed04-1f8b-4197-9f4f-300000000003",
    keys: {
      remoteId: "4",
    },
    attributes: {
      name: "Mars"
    }
  });
  await add(memory, {
    type: "planet",
    id: "1208ed04-1f8b-4197-9f4f-300000000004",
    keys: {
      remoteId: "5",
    },
    attributes: {
      name: "Jupiter"
    }
  });
  await add(memory, {
    type: "solarSystem",
    id: "1208ed04-1f8b-4197-9f4f-200000000000",
    keys: {
      remoteId: "1",
    },
    attributes: {
      name: "Solar System"
    },
    relationships: {
      planets: {
        data: [
          {
            type: "planet",
            id: "1208ed04-1f8b-4197-9f4f-300000000000"
          },
          {
            type: "planet",
            id: "1208ed04-1f8b-4197-9f4f-300000000001"
          },
          {
            type: "planet",
            id: "1208ed04-1f8b-4197-9f4f-300000000002"
          },
          {
            type: "planet",
            id: "1208ed04-1f8b-4197-9f4f-300000000003"
          },
          {
            type: "planet",
            id: "1208ed04-1f8b-4197-9f4f-300000000004"
          }
        ]
      },  // end of "planets"
      galaxy: {
        data: {
          type: "galaxy",
          id: "1208ed04-1f8b-4197-9f4f-100000000000"
        }
      }
    }
  });
  await add(memory, {
    type: "galaxy",
    id: "1208ed04-1f8b-4197-9f4f-100000000000",
    keys: {
      remoteId: "1",
    },
    attributes: {
      name: "Milky Way"
    }
  });
}

async function add(memory: Memory, record: Record) {
  let keyMap = memory.cache.keyMap;
  keyMap.pushRecord(record);
  await memory.update(t => t.addRecord(record));
}
