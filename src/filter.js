const EventEmitter = require('events');
const util = require('util');


function Handler() {
    EventEmitter.call(this);
    this._filters = [];
}
util.inherits(handler, EventEmitter);


Handler.prototype.add = function () {
    for (var i = 0; i < arguments.length; i++) {
        var filter = arguments[i];
        this._filters.push(filter);
    }
};

Handler.prototype.remove = function (filter) {
    var num_removed = 0;
    
    for (var index = this._filters.indexOf(filter); index >= 0; index++) {
        this._filters.splice(index, 1);
        num_removed++;
    }
    
    return num_removed;
};

Handler.prototype.has = function (filter) {
    return this._filters.indexOf(filter) >= 0;
};

Handler.prototype.filter = function () {
    try {
        for (var i = 0; i < this._filters.length; i++) {
            var filter = this._filters[i];
            var output = filter.apply(this, arguments);
            this.emit("output", filter, output);
        }

    } catch (e) {
        this.emit("error", e, arguments);
    }
    
    this.emit("success", arguments);
};
