const assert = require("assert");
const {MockedResponse} = require("./mock.js");
const HttpResponseProcessor = require("../src/http_response_processor.js");
const QueueProcessor = require("../src/queue_processor.js");

const simpleResponseFilter = function (request, response) {
  response.setHeader("flagProcessor", response.getHeader("flagProcessor") ? response.getHeader("flagProcessor") + 1 : 1);
};

const stopFilter = function (request, response) {
  throw response;
};

describe("HttpResponse processor", function () {
  it("should inherit QueueProcessor", function () {
    assert(new HttpResponseProcessor() instanceof QueueProcessor);
  });

  it("should process the http response", function () {
    const mockedResponse = new MockedResponse();

    const processor = new HttpResponseProcessor(
      simpleResponseFilter,
      simpleResponseFilter
    );

    processor.processQueue({}, mockedResponse);
    assert(mockedResponse.getHeader("flagProcessor"));
    assert(mockedResponse.getHeader("flagProcessor") === 2);
  });

  it("should stop the process and throw the response", function () {
    const processor = new HttpResponseProcessor(
      simpleResponseFilter,
      stopFilter,
      simpleResponseFilter
    );

    const mockedResponse = new MockedResponse();

    try {
      processor.processQueue({}, mockedResponse);
      assert(false);

    } catch(e) {
      assert(e === mockedResponse);
      assert(mockedResponse.getHeader("flagProcessor"));
      assert(mockedResponse.getHeader("flagProcessor") == 1);
    }
  });
});
