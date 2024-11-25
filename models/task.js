const mongoose = require("mongoose")

// Check if the model is already compiled
const Task =
  mongoose.models.Task ||
  mongoose.model(
    "Task",
    new mongoose.Schema({
      taskName: { type: String, required: true },
      taskDescription: { type: String },
      taskCompletion: { type: Boolean, default: false },
      taskEndDate: { type: Date, required: true },
      taskOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    })
  )

module.exports = Task
