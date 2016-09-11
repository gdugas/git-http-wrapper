const assert = require("assert");
const QueueProcessor = require("../src/queue_processor.js");

class TestProcessor extends QueueProcessor {
  handleItem(item, plus) {
    item.count = item.count + plus;
    if (item.count > 10) {
      throw item;
    }
  }
}

describe("QueueProcessor", function () {
    it("should be initialized with items", function () {
      const items = ["un", "deux", "trois"];
      const processor = new TestProcessor(items[0], items[1], items[2]);

      assert(processor.has(items[0]));
      assert(processor.has(items[1]));
      assert(processor.has(items[2]));
    });

    it("should add specified items", function () {
      const items = ["un", "deux", "trois"];
      const processor = new TestProcessor();

      assert(!processor.has(items[0]));
      processor.add(items[0]);
      assert(processor.has(items[0]));

      assert(!processor.has(items[1]));
      processor.add(items[1]);
      assert(processor.has(items[1]));

      assert(!processor.has(items[2]));
      processor.add(items[2]);
      assert(processor.has(items[2]));
    });

    it("should remove specified items", function () {
      const items = ["un", "deux", "trois"];
      const processor = new TestProcessor(items[0], items[1], items[2]);

      assert(processor.has(items[0]));
      processor.remove(items[0]);
      assert(!processor.has(items[0]));

      assert(processor.has(items[1]));
      processor.remove(items[1]);
      assert(!processor.has(items[1]));

      assert(processor.has(items[2]));
      processor.remove(items[2]);
      assert(!processor.has(items[2]));
    });

    it("should handle items", function () {
      const items = [
        {count: 0},
        {count: 1},
        {count: 2}
      ];

      const processor = new TestProcessor(items[0], items[1], items[2]);
      processor.processQueue(1);
      assert(items[0].count === 1);
      assert(items[1].count === 2);
      assert(items[2].count === 3);
    });

    it("should stop processing and throw the item", function () {
      const items = [
        {count: 0},
        {count: 1},
        {count: 2}
      ];

      const processor = new TestProcessor(items[0], items[1], items[2]);
      try {
        processor.processQueue(10);
        assert(false);

      } catch(e) {
        assert(e === items[1]);
        assert(items[0].count === 10);
        assert(items[1].count === 11);
        assert(items[2].count === 2);
      }
    });
});
