require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const morgan = require("morgan")
const session = require("express-session")
const path = require("path")
const bcrypt = require("bcryptjs")

const isSignedIn = require("./middleware/is-Signed-in")
const passUserToView = require("./middleware/pass-user-to-view")

const app = express()
const port = process.env.PORT || 3000

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log(`Connected to MongoDB: ${mongoose.connection.name}`))
  .catch((error) => console.error("Error connecting to MongoDB:", error))

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(morgan("dev"))
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
  })
)
app.use(passUserToView)
app.use(express.static("public"))

// Set view engine and views directory
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Controllers
const authController = require("./controllers/auth")
const taskController = require("./controllers/task")
const groupTaskController = require("./controllers/groupTask")

// Routes
app.use("/auth", authController)
app.use("/task", isSignedIn, taskController)
app.use("/groupTask", isSignedIn, groupTaskController)

// Landing page
app.get("/", (req, res) => {
  res.render("index", { user: req.session.user || null })
})

// Start server
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`)
})
