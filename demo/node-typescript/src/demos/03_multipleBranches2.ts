import { Branch } from "@orbit-model/contracts";
import ApplicationBranch from "@orbit-model/branch";
import Orbit from "@orbit/core";
import Planet from "../Planet";

export default async function multipleBranches2(): Promise<void> {
  let first: Branch = await ApplicationBranch.fork();

  let earth = await first
    .query()
    .select<Planet>(Planet)
    .find("1");
  Orbit.assert("found earth", earth instanceof Planet);
  Orbit.assert("found earth", earth.name === "Earth");
  earth.name = "Big Earth";
  earth.$save();

  console.log("creating second (independent) fork");
  let second: Branch = await ApplicationBranch.fork();

  let secondEarth = await second
    .query()
    .select<Planet>(Planet)
    .find("1");
  Orbit.assert("found earth", secondEarth instanceof Planet);
  Orbit.assert("found earth", secondEarth.name === "Earth");
  console.log("second fork only contains old data: ", secondEarth.name);

  await first.mergeAndDestroy();

  secondEarth = await second
    .query()
    .select<Planet>(Planet)
    .find("1");
  Orbit.assert("found earth", secondEarth instanceof Planet);
  Orbit.assert("found earth with new name", secondEarth.name === "Big Earth");
  console.log("second fork now has new data: ", secondEarth.name);
}
