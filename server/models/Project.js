const { Schema } = require("mongoose");

const ProjectSchema = new Schema({
  name: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Paused", "Completed"],
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
  },
});

module.exports = model("Project", ProjectSchema);
