const { Schema, model, Buffer } = require("mongoose");

const ClientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    data: Buffer,
  },
});

module.exports = model("Client", ClientSchema);
