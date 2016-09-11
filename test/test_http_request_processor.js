const assert = require("assert");
const {MockedRequest, MockedResponse} = require("./mock.js");
const HttpRequestProcessor = require("../src/http_request_processor.js");
const QueueProcessor = require("../src/queue_processor.js");

const simpleRequestFilter = function (request, response) {
  request.headers.flagProcessor = request.headers.flagProcessor ? request.headers.flagProcessor + 1 : 1;
};

const stopFilter = function (request, response) {
  throw response;
};

describe("HttpRequest processor", function () {
  it("should inherit QueueProcessor", function () {
    assert(new HttpRequestProcessor() instanceof QueueProcessor);
  });

  it("should process the http request", function () {
    const mockedRequest = new MockedRequest();

    const processor = new HttpRequestProcessor(
      simpleRequestFilter,
      simpleRequestFilter
    );

    processor.processQueue(mockedRequest, {});
    assert(mockedRequest.headers.flagProcessor);
    assert(mockedRequest.headers.flagProcessor === 2);
  });

  it("should stop the process and throw the response", function () {
    const processor = new HttpRequestProcessor(
      simpleRequestFilter,
      stopFilter,
      simpleRequestFilter
    );

    const mockedRequest = new MockedRequest();
    const mockedResponse = new MockedResponse();

    try {
      processor.processQueue(mockedRequest, mockedResponse);
      assert(false);

    } catch(e) {
      assert(e === mockedResponse);
      assert(mockedRequest.headers.flagProcessor);
      assert(mockedRequest.headers.flagProcessor == 1);
    }
  });
});
