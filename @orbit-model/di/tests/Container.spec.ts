import { assert, expect } from "chai";
import Container from "../src/Container";
import DefaultContainer from "../src/impl/DefaultContainer";

describe("di.Container", function () {
  class Example {}

  let container: Container;

  beforeEach(function () {
    container = new DefaultContainer();
  });

  describe("#register", function () {
    it("takes a class", function () {
      expect(() => container.getNames("test")).to.throw(/namespace/i, "init state: empty");
      container.register("test", "example", Example);
      assert.include(container.getNames("test"), "example");
    });
    it("takes a singleton class", function () {
      expect(() => container.getNames("test")).to.throw(/namespace/i, "init state: empty");
      container.register("test", "example", Example, { singleton: true });
      assert.include(container.getNames("test"), "example");
    });
    it("is able to instantiate", function () {
      expect(() => container.getNames("test")).to.throw(/namespace/i, "init state: empty");
      container.register("test", "example", Example);
      assert.instanceOf(container.get("test", "example"), Example);
    });
    it("respects the singleton option", function () {
      expect(() => container.getNames("test")).to.throw(/namespace/i, "init state: empty");
      container.register("test", "example", Example, { singleton: true });
      let inst1 = container.get("test", "example");
      assert.instanceOf(inst1, Example);
      let inst2 = container.get("test", "example");
      assert.instanceOf(inst2, Example);
      assert.strictEqual(inst1, inst2, "is singleton?");
    });
  });

  describe("#registerObject", function () {
    it("works", function () {
      expect(() => container.getNames("test")).to.throw(/namespace/i, "init state: empty");
      let inst = {};
      container.registerObject("test", "example", inst);
      assert.strictEqual(container.get("test", "example"), inst);
    });
  });

  describe("#get", function () {
    it("works", function () {
      expect(() => container.getNames("test")).to.throw(/namespace/i, "init state: empty");
      container.register("test", "example", Example);
      assert.instanceOf(container.get("test", "example"), Example);
    });
  });

  describe("#getClass", function () {
    it("works", function () {
      expect(() => container.getNames("test")).to.throw(/namespace/i, "init state: empty");
      container.register("test", "example", Example);
      assert.strictEqual(container.getClass("test", "example"), Example);
    });
  });

  describe("#getNames", function () {
    it("works", function () {
      expect(() => container.getNames("test")).to.throw(/namespace/i, "init state: empty");
      container.register("test", "example", Example);
      assert.include(container.getNames("test"), "example");
    });
  });
});
