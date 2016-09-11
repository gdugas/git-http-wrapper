const assert = require("assert");
const {Handler} = require("../src/middleware.js");

const onRequestMiddleware = {
  onRequest: function () {}
};

const onResponseMiddleware = {
  onResponse: function () {}
};

const bothMiddleware = {
  onRequest: function () {},
  onResponse: function () {}
};

const simpleRequestProcessor = function (request) {
  request.headers.flagProcessor = request.headers.flagProcessor ? request.headers.flagProcessor + 1 : 1;
};

const simpleResponseProcessor = function (request, response) {
  response.setHeader("flagProcessor", response.getHeader("flagProcessor") ? response.getHeader("flagProcessor") + 1 : 1);
};

const stopProcessor = function (request, response) {
  throw response;
};

const MockedRequest = function () {
  this.headers = {};
};

const MockedResponse = function () {
  this.headers = {};
  this.getHeader = (name) => this.headers[name];
  this.setHeader = (name, value) => {
    this.headers[name] = value;
  };
};

describe("Middleware handler", function () {
    it("should be initialized with middleware", function () {
      const handler = new Handler(
        onRequestMiddleware,
        onResponseMiddleware,
        bothMiddleware
      );

      assert(handler.has(onRequestMiddleware));
      assert(handler.has(onResponseMiddleware));
      assert(handler.has(bothMiddleware));
    });

    it("should add specified middlewares", function () {
      const handler = new Handler();

      assert(!handler.has(onRequestMiddleware));
      handler.add(onRequestMiddleware);
      assert(handler.has(onRequestMiddleware));

      assert(!handler.has(onResponseMiddleware));
      handler.add(onResponseMiddleware);
      assert(handler.has(onResponseMiddleware));

      assert(!handler.has(bothMiddleware));
      handler.add(bothMiddleware);
      assert(handler.has(bothMiddleware));
    });

    it("should remove specified middlewares", function () {
      const handler = new Handler(
        onRequestMiddleware,
        onResponseMiddleware,
        bothMiddleware
      );

      assert(handler.has(onRequestMiddleware));
      handler.remove(onRequestMiddleware);
      assert(!handler.has(onRequestMiddleware));

      assert(handler.has(onResponseMiddleware));
      handler.remove(onResponseMiddleware);
      assert(!handler.has(onResponseMiddleware));

      assert(handler.has(bothMiddleware));
      handler.remove(bothMiddleware);
      assert(!handler.has(bothMiddleware));
    });

    it("should process request", function () {
      const mockedRequest = new MockedRequest();

      const handler = new Handler(
        {onRequest: simpleRequestProcessor},
        {onRequest: simpleRequestProcessor}
      );

      handler.processRequest(mockedRequest, {});
      assert(mockedRequest.headers.flagProcessor);
      assert(mockedRequest.headers.flagProcessor === 2);
    });

    it("should process response", function () {
      const mockedResponse = new MockedResponse();

      const handler = new Handler(
        {onResponse: simpleResponseProcessor},
        {onResponse: simpleResponseProcessor}
      );

      handler.processResponse({}, mockedResponse);
      assert(mockedResponse.getHeader("flagProcessor"));
      assert(mockedResponse.getHeader("flagProcessor") === 2);
    });

    it("should stop request processing and throw the response", function () {
      const handler = new Handler(
        {onRequest: simpleRequestProcessor},
        {onRequest: (request, response) => response},
        {onRequest: simpleRequestProcessor}
      );

      const mockedRequest = new MockedRequest();
      const mockedResponse = new MockedResponse();

      try {
        handler.processRequest(mockedRequest, mockedResponse);
        assert(false);

      } catch(e) {
        assert(mockedRequest.headers.flagProcessor);
        assert(mockedRequest.headers.flagProcessor == 1);
        assert(e === mockedResponse);
      }
    });

    it("should stop response processing", function () {
      const handler = new Handler(
        {onResponse: simpleResponseProcessor},
        {onResponse: (request, response) => response},
        {onResponse: simpleResponseProcessor}
      );

      const mockedResponse = new MockedResponse();

      try {
        handler.processResponse(new MockedRequest(), mockedResponse);
        assert(false);

      } catch(e) {
        assert(mockedResponse.getHeader("flagProcessor"));
        assert(mockedResponse.getHeader("flagProcessor") === 1);
        assert(e === mockedResponse);
      }
    });
});
