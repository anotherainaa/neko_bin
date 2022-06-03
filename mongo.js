const Requests = require('./models/requests');

async function findRequests(requestId) {
  return await Requests.find({ requestId: requestId }).then((result) => {
    return result;
  });
}

async function createRequest(id, payload) {
  const request = new Requests({
    requestId: id,
    payLoad: payload,
  });

  request.save().then(() => {
    console.log(`Added ${id} to MongoDB`);
    // mongoose.connection.close();
  });
}

// createRequest(1, JSON.stringify({body: "hello world"}));

module.exports = {
  findRequests,
  createRequest,
};

