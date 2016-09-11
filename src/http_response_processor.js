const QueueProcessor = require("./queue_processor.js");

class HttpResponseProcessor extends QueueProcessor {
  handleItem(filter, request, response) {
    const filterResponse = filter(request, response);
    if (filterResponse) {
      throw filterResponse;
    }
  }
}

module.exports = HttpResponseProcessor;
