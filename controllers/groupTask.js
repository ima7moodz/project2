const express = require("express")
const GroupTask = require("../models/groupTask")

const router = express.Router()

// Route to display all group tasks
router.get("/", async (req, res) => {
  try {
    const groups = await GroupTask.find({}).populate("groupOwner")

    res.render("groupTask/index", { groups: groups })
  } catch (error) {
    console.error("Error fetching group tasks:", error)
    res.status(500).send("Server Error")
  }
})

router.get("/new", (req, res) => {
  res.render("groupTask/new.ejs")
})

router.post("/", async (req, res) => {
  req.body.groupOwner = req.session.user._id
  await GroupTask.create(req.body)
  res.redirect("/groupTask")
})

module.exports = router
