const mongoose = require("mongoose");

function isValidMongoDbId(id) {
  return mongoose.isValidObjectId(id);
}

module.exports = { isValidMongoDbId };
