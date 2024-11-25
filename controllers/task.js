const express = require("express")
const Task = require("../models/task")
const User = require("../models/user")

const router = express.Router()

router.get("/", async (req, res) => {
  const tasks = await Task.find({ taskOwner: req.session.user._id })
  res.render("task/index.ejs", { tasks })
})

router.get("/new", (req, res) => {
  res.render("task/new.ejs")
})

router.post("/", async (req, res) => {
  req.body.taskOwner = req.session.user._id
  await Task.create(req.body)
  res.redirect("/task")
})

//mark the task if it complete
router.put("/:id/complete", async (req, res) => {
  const task = await Task.findById(req.params.id)
  task.taskCompletion = true
  await task.save()
  res.redirect("/task")
})

router.put("/:id/uncomplete", async (req, res) => {
  const task = await Task.findById(req.params.id)
  task.taskCompletion = false
  await task.save()
  res.redirect("/task")
})

//edit the task
router.get("/:taskId/editTask", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id)
    const task = currentUser.task.id(req.params.taskId)
    res.render("task/editTask.ejs", {
      task: task,
    })
  } catch (error) {
    console.log(error)
    res.redirect("/")
  }
})

router.put("/:taskId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id)

    const task = currentUser.task.id(req.params.taskId)

    task.set(req.body)
    await currentUser.save()

    res.redirect(`/users/${currentUser._id}/task/${req.params.taskId}`)
  } catch (error) {
    console.log(error)
    res.redirect("/")
  }
})

module.exports = router
