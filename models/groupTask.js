const mongoose = require("mongoose")

const groupTaskSchema = new mongoose.Schema({
  groupName: {
    type: String,
    require: true,
  },
  groupDescription: {
    type: String,
  },
  groupOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  taskOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  usersInGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})
