import "@orbit-model/bootstrap"; // workaround
import {SchemaBuilder} from "@orbit-model/model";
import Memory from "@orbit/memory";
import "./Planet"; // workaround
import "./SolarSystem"; // workaround
import "./Galaxy"; // workaround
import {RecordKeyMap} from "@orbit/records";
import ApplicationBranch from "@orbit-model/branch";
import {demoData} from "./demoData";
import queryAndCreateModels from "./demos/01_queryAndCreateModels";
import multipleBranches from "./demos/02_multipleBranches";
import multipleBranches2 from "./demos/03_multipleBranches2";
import modificationPriority from "./demos/04_modificationPriority";
import autoUpdate from "./demos/05_autoUpdate";

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
    modificationPriority,
    autoUpdate
  ];

  for (let f of functions) {
    console.log();
    console.log("### START running function:", f.name, "#######################");
    // setup application
    let keyMap = new RecordKeyMap();
    let memory = new Memory({schema, keyMap});
    ApplicationBranch.setup(memory);
    await demoData(memory);

    try {
      await f();
    } catch (e) {
      console.error("funktion ", f.name, " has thrown an exception: ", e);
    }

    console.log("### END of function:", f.name, "##############################");
  }
})();

// function waitFor(milliseconds: number): Promise<void> {
//   return new Promise(resolve => {
//     setTimeout(resolve, milliseconds);
//   });
// }
