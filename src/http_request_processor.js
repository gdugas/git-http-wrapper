const QueueProcessor = require("./queue_processor.js");

class HttpRequestProcessor extends QueueProcessor {
  handleItem(filter, request, response) {
    const filterResponse = filter(request, response);
    if (filterResponse) {
      throw filterResponse;
    }
  }
}

module.exports = HttpRequestProcessor;
