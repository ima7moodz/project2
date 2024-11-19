const express = require('express')
const router = express.Router()

const User = require('../models/user.js')

const bcrypt = require('bcrypt')

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs')
})

router.post('/sign-up', async (req, res) => {
  // checking if the user already exist or not
  const userInDatabase = await User.findOne({ username: req.body.username })
  if (userInDatabase) {
    return res.send('Username already taken.')
  }

  // checking if both password are equal or not
  if (req.body.password !== req.body.confirmPassword) {
    return res.send('Password and Confirm Password must match')
  }

  // Register the user
  // Use bcrypt library for password encryption
  const hashedPassword = bcrypt.hashSync(req.body.password, 10) // 10 is the SALT , which is how many round I want it to be encrypted (More secure), the maximum is 15 but the stander is 10
  req.body.password = hashedPassword

  // validation logic
  const user = await User.create(req.body)
  res.send(`Thanks for signing up ${user.username}`)
})

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs')
})

router.post('/sign-in', async (req, res) => {
  //Check if the user exist in the database
  const userInDatabase = await User.findOne({ username: req.body.username })

  // Means if it's NULL
  if (!userInDatabase) {
    return res.send('Login failed. Please try again.')
  }

  // Validate if the entered password matches the one on the database
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  )
  if (!validPassword) {
    return res.send('Login failed. Please try again.')
  }

  //Log the user in
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  }

  res.redirect('/')
})

router.get('/sign-out', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

module.exports = router
