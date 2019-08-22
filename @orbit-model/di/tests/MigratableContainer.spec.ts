import { assert, expect } from "chai";
import DefaultContainer from "../src/impl/DefaultContainer";
import MigratableContainer from "../src/MigratableContainer";

describe("di.Container", function() {
  class Example {}

  let container: MigratableContainer;

  beforeEach(function() {
    container = new DefaultContainer();
  });

  describe("#registerInstantiatedSingleton", function() {
    it("takes a singelton", function() {
      expect(() => container.getNames("test")).to.throw(/namespace/i, "init state: empty");
      let instance = new Example();
      container.registerInstantiatedSingleton("test", "example", Example, instance);
      assert.include(container.getNames("test"), "example");
    });
  });

  describe("#registerObject", function() {
    it("works", function() {
      expect(() => container.getNames("test")).to.throw(/namespace/i, "init state: empty");
      let inst = {};
      container.registerObject("test", "example", inst);
      assert.strictEqual(container.get("test", "example"), inst);
    });
  });
});
