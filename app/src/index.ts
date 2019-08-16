import "@orbit-model/bootstrap"; // workaround
import { SchemaBuilder } from "@orbit-model/model";
import Memory from '@orbit/memory';
import "./Planet"; // workaround
import './SolarSystem'; // workaround
import './Galaxy'; // workaround
import Orbit, { KeyMap } from "@orbit/data";
import ApplicationBranch from "@orbit-model/branch";
import { Branch } from "../../@orbit-model/contracts";
import { demoData } from "./demoData";
import SolarSystem from "./SolarSystem";
import Galaxy from "./Galaxy";
import { Adapter } from "@orbit-model/middleware";
import Planet from "./Planet";

// fail on unhandled promise exceptions
process.on('unhandledRejection', up => {
  throw up
});

(async function main() {
  let schema = SchemaBuilder.createSchema();
  let keyMap = new KeyMap();

  let memory = new Memory({ schema, keyMap });

  ApplicationBranch.setup(memory);
  let workBranch: Branch = await ApplicationBranch.fork();

  await demoData(memory);

  let theSolarSystem: SolarSystem = await workBranch.query().select<SolarSystem>(SolarSystem).find("1");
  Orbit.assert("found solar system with id 1", theSolarSystem !== null);
  console.log('our solar system', theSolarSystem);
  console.log('JSON', JSON.stringify(theSolarSystem));

  let planets = await theSolarSystem.planets().getAll();
  Orbit.assert("related planets result is array", Array.isArray(planets));
  Orbit.assert("found related planets", planets.length === 5);
  console.log('planets', planets);
  console.log('JSON', JSON.stringify(planets));

  let theMilkyWay: Galaxy = await theSolarSystem.galaxy().get();
  Orbit.assert("found our home galaxy", theMilkyWay !== null);


  console.log("start adding own stuff to the universe...");
  let mySolarSystem = Adapter.create<SolarSystem>(SolarSystem, workBranch);
  mySolarSystem.name = "My beautiful Solar-System";
  mySolarSystem.galaxy().set(theMilkyWay);
  console.log("created my very own SolarSystem", mySolarSystem);

  let myPlanet = Adapter.create<Planet>(Planet, workBranch);
  myPlanet.name = "My beautiful Planet";
  myPlanet.solarSystem().set(theSolarSystem);
  console.log("added a Planet to my SolarSystem", myPlanet);

  let planetsPlus = await workBranch.query().select<Planet>(Planet).get();
  Orbit.assert("one more planet:", Array.isArray(planetsPlus));
  Orbit.assert("one more planet:", planetsPlus.length === 6);

})();


function waitFor(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
