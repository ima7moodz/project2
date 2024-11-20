const express = require("express")
const router = express.Router()

const Task = require("../models/task")

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({}).populate("taskOwner")
    console.log("tasks: ", tasks)
    res.render("task/index.ejs", { tasks })
  } catch (error) {
    console.log(error)
    res.redirect("/")
  }
})

router.get("/new", (req, res) => {
  res.render("task/new.ejs")
})

router.post("/", async (req, res) => {
  req.body.taskOwner = req.session.user._id
  await Task.create(req.body)
  res.redirect("/task")
})

module.exports = router
