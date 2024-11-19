const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()

const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')

const session = require('express-session')

const isSignedIn = require('./middleware/is-Signed-in')

const passUserToView = require('./middleware/pass-user-to-view.js')

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : '3000'

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }))
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride('_method'))
// Morgan for logging HTTP requests
app.use(morgan('dev'))

app.use(
  session({
    secret: process.env.SESSION_SECRET, // Encrypt the session using this secret
    resave: false,
    saveUninitialized: true
  })
)
app.use(passUserToView)

//Require Controller
const authController = require('./controllers/auth')
//Use Controller
app.use('/auth', authController)

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`)
})

//Landing page
// app.get('/', async (req, res) => {
//   res.send('Hello...')
// })
app.get('/', async (req, res) => {
  res.render('index.ejs', { user: req.session.user })
})

//Not a good practice to write it in this file
// app.get('/vip-lounge', (req, res) => {
//   if (req.session.user) {
//     res.send(`Welcome to the party ${req.session.user.username}.`)
//   } else {
//     res.send('Sorry, no guests allowed.')
//   }
// })

// Using the middleware
app.get('/vip-lounge', isSignedIn, (req, res) => {
  res.send(`Welcome to the party ${req.session.user.username}.`)
})
