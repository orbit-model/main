import { Branch } from "@orbit-model/contracts";
import ApplicationBranch from "@orbit-model/branch";
import Orbit from "@orbit/core";
import Planet from "../Planet";

export default async function autoUpdate(): Promise<void> {
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
  console.log("first branch earth name: ", firstEarth.name);
  console.log("second branch earth name: ", secondEarth.name);
  Orbit.assert("found earth with new name", secondEarth.name === "Earth");

  await first.mergeAndDestroy();

  console.log("second branch earth name auto changes: ", secondEarth.name);
  Orbit.assert("found earth with new name", secondEarth.name === "Big Earth");
}
