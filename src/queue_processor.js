
const QueueProcessor = class {

  constructor() {
    this._queue = [];
    this.add.apply(this, arguments);
  }

  add() {
    return this._queue.push.apply(this._queue, arguments);
  }

  has(item) {
    return this._queue.indexOf(item) >= 0;
  }

  remove(item) {
    const index = this._queue.indexOf(item);
    if (index >= 0) {
      this._queue.splice(index, 1);
    }
  }

  processQueue() {
    const args = Array.from(arguments);
    args.unshift(null);

    for (let i = 0; i < this._queue.length; i++) {
      const item = this._queue[i];
      args[0] = item;
      this.handleItem.apply(this, args);
    }
  }
};

module.exports = QueueProcessor;
