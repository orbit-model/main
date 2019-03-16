import { assert, expect } from 'chai';
import Container from "../src/Container";
import DefaultContainer from "../src/impl/DefaultContainer";


describe('di.Container', function () {

  let container: Container;

  beforeEach(function () {
    container = new DefaultContainer()
  });

  describe('#register', function () {
    it('takes a class', function () {
      class example {
      }

      expect(() => container.getNames('test')).to.throw(/namespace/i, "init state: empty");
      container.register('test', 'example', example);
      assert.include(container.getNames('test'), 'example');
    });
    it('takes a singleton class', function () {
      class example {
      }

      expect(() => container.getNames('test')).to.throw(/namespace/i, "init state: empty");
      container.register('test', 'example', example, { singleton: true });
      assert.include(container.getNames('test'), 'example');
    });
    it('is able to instantiate', function () {
      class example {
      }

      container.register('test', 'example', example);
      assert.instanceOf(container.get('test', 'example'), example);
    });

  });

});
