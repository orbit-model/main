import "@orbit-model/bootstrap"; // workaround
import { SchemaBuilder } from "@orbit-model/model";
import Memory from "@orbit/memory";
import "./Planet"; // workaround
import "./SolarSystem"; // workaround
import "./Galaxy"; // workaround
import { KeyMap } from "@orbit/data";
import ApplicationBranch from "@orbit-model/branch";
import { demoData } from "./demoData";
import queryAndCreateModels from "./demos/01_queryAndCreateModels";
import multipleBranches from "./demos/02_multipleBranches";
import multipleBranches2 from "./demos/03_multipleBranches2";
import modificationPriority from "./demos/04_modificationPriority";

// fail on unhandled promise error
process.on("unhandledRejection", up => {
  throw up;
});

(async function main(): Promise<void> {
  let schema = SchemaBuilder.createSchema();

  let functions: (() => Promise<void>)[] = [
    queryAndCreateModels,
    multipleBranches,
    multipleBranches2,
    modificationPriority
  ];

  for (let f of functions) {
    console.log();
    console.log("### START running function:", f.name, "#######################");
    // setup application
    let keyMap = new KeyMap();
    let memory = new Memory({ schema, keyMap });
    ApplicationBranch.setup(memory);
    await demoData(memory);

    await f();

    console.log("### END of function:", f.name, "##############################");
  }
})();

// function waitFor(milliseconds: number): Promise<void> {
//   return new Promise(resolve => {
//     setTimeout(resolve, milliseconds);
//   });
// }
