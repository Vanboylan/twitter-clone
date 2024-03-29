const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Tweet = require("./models/tweet");
const User = require("./models/user");
const session = require("express-session");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");
const homeRouter = require("./routes/home");
const usersRouter = require("./routes/users");
const tweetsRouter = require("./routes/tweets");
const sessionsRouter = require("./routes/sessions");

const app = express();

//setup middleware
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//PORT setup
const PORT = process.env.PORT || 3000;

//DB connection

mongoose.connect(
  "mongodb://127.0.0.1/twitter",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // bufferCommands: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Database connected, link established");
    }
  }
);

app.use(
  session({
    key: "user_sid",
    secret: "super_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

//helper
function isValidTweet(body) {
  return (
    body.username &&
    body.username.trim() != "" &&
    body.content &&
    body.content.trim() != ""
  );
}

function tagParser(text) {
  return text.match(/#([a-z0-9]{1,30})/gi);
}

const sessionChecker = (req, res, next) => {
  if (!req.session.user && !req.cookies.user_sid) {
    res.redirect("/");
  } else {
    next();
  }
};

app.use(bodyParser.json());
app.use("/", homeRouter);
app.use("/users", usersRouter);
app.use("/users/:id", sessionChecker, usersRouter);
app.use("/users/index", sessionChecker, usersRouter);

app.use("/tweets", sessionChecker, tweetsRouter);
app.use("/tweets/:id", sessionChecker, tweetsRouter);
app.use("/tweets/comments/:id", sessionChecker, tweetsRouter);
app.use("/tweets/comments", sessionChecker, tweetsRouter);
app.use("/sessions", sessionsRouter);

app.listen(PORT, () => console.log(`listening on port ${PORT}...`));

module.exports = app;
