const mongoose = require("mongoose")

const groupTaskSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  groupDescription: { type: String },
  groupOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  usersInGroup: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
})

const GroupTask = mongoose.model("GroupTask", groupTaskSchema)
module.exports = GroupTask
