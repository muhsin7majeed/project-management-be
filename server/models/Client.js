const { Schema, model, Buffer } = require("mongoose");

const ClientSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  avatar: {
    type: String,
    data: Buffer,
  },
});

module.exports = model("Client", ClientSchema);
