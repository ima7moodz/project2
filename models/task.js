const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  taskDescription: {
    type: String,
  },
  taskCompletion: {
    type: Boolean,
    default: false,
  },
  taskEndDate: {
    type: Date,
    required: true,
  },
  taskOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  groupTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GroupTask",
  },
})

const Task = mongoose.model("Task", taskSchema)
module.exports = Task
