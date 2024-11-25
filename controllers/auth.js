const express = require("express")
const bcrypt = require("bcrypt")
const User = require("../models/user")

const router = express.Router()

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs")
})

router.post("/sign-up", async (req, res) => {
  const { username, password, confirmPassword } = req.body

  if (password !== confirmPassword) {
    return res.send("Passwords do not match.")
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.send("Username is already taken.")
  }

  const hashedPassword = bcrypt.hashSync(password, 10)
  await User.create({ username, password: hashedPassword })
  res.send("User created successfully!")
})

router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs")
})

router.post("/sign-in", async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.send("Invalid username or password.")
  }

  req.session.user = { _id: user._id, username: user.username }
  res.redirect("/")
})

router.get("/sign-out", (req, res) => {
  req.session.destroy()
  res.redirect("/")
})

module.exports = router
