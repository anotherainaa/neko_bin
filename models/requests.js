// const config = require('../lib/config');
require('dotenv').config();
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log(`error connecting to MongoDB${error.message}`);
  });

const requestsSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
  },
  payLoad: {
    type: String,
    required: true,
  },
});

const Requests = mongoose.model('Requests', requestsSchema);

requestsSchema.set('toJSON', {
  // virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.requestId;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = Requests;
