
module.exports.MockedRequest = function () {
  this.headers = {};
};

module.exports.MockedResponse = function () {
  this.headers = {};
  this.getHeader = (name) => this.headers[name];
  this.setHeader = (name, value) => {
    this.headers[name] = value;
  };
};
