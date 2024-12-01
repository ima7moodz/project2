const express = require("express")
const Task = require("../models/task")

const router = express.Router()

// Show all tasks (both private and group tasks)
router.get("/", async (req, res) => {
  try {
    const userId = req.session.user._id // Get the current user's ID
    const tasks = await Task.find({
      $or: [
        { taskOwner: userId }, // Private tasks owned by the user
        {
          groupTask: { $exists: true, $ne: null },
          "groupTask.members": userId,
        }, // Group tasks the user is a member of
      ],
    }).populate("groupTask")

    // Separate tasks for rendering
    const privateTasks = tasks.filter((task) => !task.groupTask)
    const groupTasks = tasks.filter((task) => task.groupTask)

    res.render("task/index.ejs", { privateTasks, groupTasks })
  } catch (error) {
    console.error(error)
    res.redirect("/")
  }
})

// Render the form to create a new task
router.get("/new", (req, res) => {
  res.render("task/new.ejs")
})

// Create a new task
router.post("/", async (req, res) => {
  try {
    req.body.taskOwner = req.session.user._id
    await Task.create(req.body)
    res.redirect("/task")
  } catch (error) {
    console.error(error)
    res.redirect("/")
  }
})

// Mark a task as complete
router.put("/:id/complete", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    task.taskCompletion = true
    await task.save()
    res.redirect("/task")
  } catch (error) {
    console.error(error)
    res.redirect("/")
  }
})

// Mark a task as incomplete
router.put("/:id/uncomplete", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    task.taskCompletion = false
    await task.save()
    res.redirect("/task")
  } catch (error) {
    console.error(error)
    res.redirect("/")
  }
})

// Show task details
router.get("/:taskId", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId).populate("taskOwner")
    res.render("task/show.ejs", { task })
  } catch (error) {
    console.error(error)
    res.redirect("/")
  }
})

// Delete a task
router.delete("/:taskId", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
    await task.deleteOne()
    res.redirect("/task")
  } catch (error) {
    console.error("Error deleting task:", error)
    res.redirect("/")
  }
})

// Render the form to edit a task
router.get("/:taskId/editTask", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
    res.render("task/editTask.ejs", { task })
  } catch (error) {
    console.error(error)
    res.redirect("/")
  }
})

// Update a task
router.put("/:taskId", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
    await task.updateOne(req.body)
    res.redirect("/task")
  } catch (error) {
    console.error(error)
    res.redirect("/")
  }
})

router.use

module.exports = router
