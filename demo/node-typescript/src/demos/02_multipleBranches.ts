import { Branch } from "@orbit-model/contracts";
import ApplicationBranch from "@orbit-model/branch";
import Orbit from "@orbit/core";
import Planet from "../Planet";

export default async function multipleBranches(): Promise<void> {
  let first: Branch = await ApplicationBranch.fork();

  let testPlanet = new Planet(first);
  let testPlanet2 = new Planet(first);
  let testPlanet3 = new Planet(first);

  await testPlanet.$save();
  await testPlanet2.$save();
  await testPlanet3.$save();
  let planets = await first
    .query()
    .select<Planet>(Planet)
    .get();
  Orbit.assert("three more planet:", Array.isArray(planets) && planets.length === 8);

  console.log("creating second (independent) fork");
  let second: Branch = await ApplicationBranch.fork();

  let secondBranchPlanets = await second
    .query()
    .select<Planet>(Planet)
    .get();
  Orbit.assert("still using demo data only", Array.isArray(secondBranchPlanets) && secondBranchPlanets.length === 5);
  console.log("second fork only contains old data: ", secondBranchPlanets.length);

  await first.mergeAndDestroy();

  secondBranchPlanets = await second
    .query()
    .select<Planet>(Planet)
    .get();
  Orbit.assert(
    "now having access to additional data",
    Array.isArray(secondBranchPlanets) && secondBranchPlanets.length === 8
  );
  console.log("second fork now contains new data from first work-branch: ", secondBranchPlanets.length);
}
