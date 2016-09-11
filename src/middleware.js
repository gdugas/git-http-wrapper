
const Handler = function (middlewares) {
  this._middlewares = [];
  this.add.apply(this, arguments);
};

Handler.prototype.add = function () {
  return this._middlewares.push.apply(this._middlewares, arguments);
};

Handler.prototype.has = function (middleware) {
  return this._middlewares.indexOf(middleware) >= 0;
};

Handler.prototype.remove = function (middleware) {
  const index = this._middlewares.indexOf(middleware);
  if (index >= 0) {
    this._middlewares.splice(index, 1);
  }
};

Handler.prototype.processMiddleware = function (middleware, request, response) {
  if (middleware) {
    const middlewareResponse = middleware(request, response);
    if (middlewareResponse) {
      throw middlewareResponse;
    }
  }
};

Handler.prototype.processRequest = function (request, response) {
  for (let i = 0; i < this._middlewares.length; i++) {
    const middleware = this._middlewares[i].onRequest;
    this.processMiddleware(middleware, request, response);
  }
};

Handler.prototype.processResponse = function (request, response) {
  for (let i = this._middlewares.length - 1; i >= 0 ; i--) {
    const middleware = this._middlewares[i].onResponse;
    this.processMiddleware(middleware, request, response);
  }
};

module.exports.Handler = Handler;
