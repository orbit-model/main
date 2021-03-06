import { Branch } from "@orbit-model/contracts";
import ApplicationBranch from "@orbit-model/branch";
import SolarSystem from "../SolarSystem";
import Orbit from "@orbit/core";
import Galaxy from "../Galaxy";
import { Middleware } from "@orbit-model/middleware";
import Planet from "../Planet";

export default async function queryAndCreateModels(): Promise<void> {
  let workBranch: Branch = await ApplicationBranch.fork();

  let theSolarSystem: SolarSystem = await workBranch
    .query()
    .select<SolarSystem>(SolarSystem)
    .find("1");
  Orbit.assert("found solar system with id 1", theSolarSystem !== null);
  console.log("our solar system", theSolarSystem);
  console.log("JSON", JSON.stringify(theSolarSystem));

  let planets = await theSolarSystem.planets().getAll();
  Orbit.assert("found related planets", Array.isArray(planets) && planets.length === 5);
  console.log("planets", planets);
  console.log("JSON", JSON.stringify(planets));

  let theMilkyWay: Galaxy = await theSolarSystem.galaxy().get();
  Orbit.assert("found our home galaxy", theMilkyWay !== null);

  console.log("start adding own stuff to the universe...");
  let mySolarSystem = Middleware.create<SolarSystem>(SolarSystem, workBranch);
  mySolarSystem.name = "My beautiful Solar-System";
  mySolarSystem.galaxy().set(theMilkyWay);
  console.log("created my very own SolarSystem", mySolarSystem);

  let myPlanet = Middleware.create<Planet>(Planet, workBranch);
  myPlanet.name = "My beautiful Planet";
  myPlanet.solarSystem().set(theSolarSystem);
  console.log("added a Planet to my SolarSystem", myPlanet);

  let planetsPlus = await workBranch
    .query()
    .select<Planet>(Planet)
    .get();
  Orbit.assert("one more planet:", Array.isArray(planetsPlus) && planetsPlus.length === 6);

  let testPlanet = new Planet(workBranch);
  let planetsPlusPlus = await workBranch
    .query()
    .select<Planet>(Planet)
    .get();
  Orbit.assert("one more planet:", Array.isArray(planetsPlusPlus) && planetsPlusPlus.length === 6);

  await testPlanet.$save();
  planetsPlusPlus = await workBranch
    .query()
    .select<Planet>(Planet)
    .get();
  Orbit.assert("one more planet:", Array.isArray(planetsPlusPlus) && planetsPlusPlus.length === 7);
}
