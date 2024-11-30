const express = require("express")
const GroupTask = require("../models/groupTask")
const Task = require("../models/task")

const router = express.Router()

// Route to display all group tasks
router.get("/", async (req, res) => {
  try {
    const groups = await GroupTask.find({}).populate("groupOwner")
    res.render("groupTask/index", { groups: groups })
  } catch (error) {
    console.error(error)
    res.redirect("/")
  }
})

// Route to render form for creating a new group task
router.get("/new", (req, res) => {
  res.render("groupTask/new.ejs")
})

// Route to display a specific group with its tasks
router.get("/:id", async (req, res) => {
  try {
    const groupId = req.params.id

    const group = await GroupTask.findById(groupId)
      .populate("groupOwner")
      .populate("usersInGroup")
      .populate("groupTask")

    res.render("groupTask/show", {
      group,
      currentUserId: req.session.user ? req.session.user._id : null,
    })
  } catch (error) {
    console.error(error)
    res.redirect("/")
  }
})

// Route to create a new group task
router.post("/", async (req, res) => {
  try {
    req.body.groupOwner = req.session.user._id // Ensure user is logged in
    const group = await GroupTask.create(req.body)
    res.redirect("/groupTask")
  } catch (error) {
    console.error(error)
    res.redirect("/")
  }
})

// Route for users to join a group
router.post("/:id/join", async (req, res) => {
  try {
    const groupId = req.params.id
    const group = await GroupTask.findById(groupId)

    if (!group.usersInGroup.includes(req.session.user._id)) {
      group.usersInGroup.push(req.session.user._id)
      await group.save()
      res.redirect(`/groupTask/${groupId}`)
    } else {
      res.send("You are already a member of this group")
    }
  } catch (error) {
    console.error(error)
    res.redirect("/")
  }
})

// Route to create a new task within a group
router.post("/:groupId/task", async (req, res) => {
  try {
    const groupId = req.params.groupId
    const { taskName, taskDescription, taskEndDate } = req.body
    const userId = req.session.user._id

    const group = await GroupTask.findById(groupId).populate("usersInGroup")

    const newTask = new Task({
      taskName,
      taskDescription,
      taskEndDate,
      taskOwner: userId,
      groupTask: groupId,
    })

    await newTask.save()

    group.groupTask.push(newTask._id)
    await group.save()

    res.redirect(`/groupTask/${groupId}`)
  } catch (error) {
    console.error(error)
    res.redirect("/")
  }
})

// Route to delete a group
router.delete("/:groupId", async (req, res) => {
  try {
    const groupId = req.params.groupId

    const group = await GroupTask.findById(groupId)

    await group.deleteOne()

    await Task.deleteMany({ groupTask: groupId })

    res.redirect("/groupTask")
  } catch (error) {
    console.error(error)
    res.redirect("/")
  }
})

module.exports = router
