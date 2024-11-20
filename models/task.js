const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    require: true,
  },
  taskDescription: {
    type: String,
  },
  taskComplition: {
    type: Boolean,
    require: true,
    default: false,
  },
  taskEndDate: {
    type: Date,
    require: true,
  },
  taskType: {
    type: String,
    enum: ["private", "published"],
    required: true,
    default: "private",
  },
  taskOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  Group: {
    type: mongoose.Types.ObjectId,
    ref: "GroupTask",
  },
})

const Task = mongoose.model("Task", taskSchema)

module.exports = Task
