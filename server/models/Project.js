const { Schema, model } = require("mongoose");

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "In Progress", "Paused", "Completed"],
  },
  client: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Client",
  },

  description: {
    type: String,
  },
});

module.exports = model("Project", ProjectSchema);
