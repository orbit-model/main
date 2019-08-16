import { SchemaBuilder } from "@orbit-model/bootstrap";
import Memory from '@orbit/memory';
import "./Planet";  // workaround
import './SolarSystem'; // workaround
import { KeyMap } from "@orbit/data";
import ApplicationBranch from "@orbit-model/branch";
import { Branch } from "@orbit-model/core";
import { demoData } from "./demoData";
import SolarSystem from "./SolarSystem";

// fail on unhandled promise exceptions
process.on('unhandledRejection', up => { throw up });

(async function main() {
  let schema = SchemaBuilder.createSchema();
  let keyMap = new KeyMap();

  let memory = new Memory({ schema, keyMap });

  ApplicationBranch.setup(memory);
  let workBranch: Branch = await ApplicationBranch.fork();

  await demoData(memory);

  let theSolarSystem: SolarSystem = await workBranch.query().select<SolarSystem>(SolarSystem).find("1");
  console.log('our solar system', theSolarSystem);
  console.log('JSON', JSON.stringify(theSolarSystem));

  let planets = await theSolarSystem.planets().getAll();
  console.log('planets', planets.length, theSolarSystem.planets);
  console.log('JSON', JSON.stringify(planets));
})();


function waitFor(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
