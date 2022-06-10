const { Schema, model } = require("mongoose");

const ClientSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
});

module.exports = model("Client", ClientSchema);
