import { Branch } from "@orbit-model/contracts";
import ApplicationBranch from "@orbit-model/branch";
import Orbit from "@orbit/core";
import Planet from "../Planet";

export default async function modificationPriority(): Promise<void> {
  console.log("creating first fork");
  let first: Branch = await ApplicationBranch.fork();

  let firstEarth = await first
    .query()
    .select<Planet>(Planet)
    .find("1");
  Orbit.assert("found earth", firstEarth.name === "Earth");

  console.log("creating second (independent) fork");
  let second: Branch = await ApplicationBranch.fork();

  let secondEarth = await second
    .query()
    .select<Planet>(Planet)
    .find("1");
  Orbit.assert("found earth", secondEarth.name === "Earth");
  console.log("second fork only contains old name: ", secondEarth.name);

  // setting a new name for planet Earth
  firstEarth.name = "Big Earth";
  await firstEarth.$save();
  console.log("first branch earth name: ", firstEarth.name);

  // setting a new name for planet Earth on second branch
  secondEarth.name = "Great Earth";
  await secondEarth.$save();
  console.log("second branch earth name: ", secondEarth.name);

  await first.mergeAndDestroy();

  secondEarth = await second
    .query()
    .select<Planet>(Planet)
    .find("1");
  Orbit.assert("found earth with new name", secondEarth.name === "Great Earth");
  console.log("second branch earth name takes priority: ", secondEarth.name);

  //### the other way round: same result ######################################
  // recreate first branch
  first = await ApplicationBranch.fork();

  let firstMars = await first
    .query()
    .select<Planet>(Planet)
    .find("4");
  Orbit.assert("found earth", firstMars.name === "Mars");

  let secondMars = await second
    .query()
    .select<Planet>(Planet)
    .find("4");
  Orbit.assert("found earth", secondMars.name === "Mars");
  console.log("second fork only contains old name: ", secondMars.name);

  // setting a new name for planet Earth on second branch
  secondMars.name = "Great Mars";
  await secondMars.$save();
  console.log("second branch mars name: ", secondMars.name);

  // setting a new name for planet Earth
  firstMars.name = "Big Mars";
  await firstMars.$save();
  console.log("first branch mars name: ", firstMars.name);

  await first.mergeAndDestroy();

  secondMars = await second
    .query()
    .select<Planet>(Planet)
    .find("4");
  console.log("second branch mars name still takes priority: ", secondMars.name);
  Orbit.assert("second branch mars name still takes priority", secondMars.name === "Great Mars");
  // this is because changes will be applied in this order:
  //  1. Everything from the application branch
  //  2. on top of 1. all the changes of a sub branch
  //  3. in a sub sub branch (fork of a Branch) all the changes are put on top of its parent branch
}
