const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Tweet = require("../client/models/tweet");
const session = require("express-session");
require("dotenv").config();

app = express();

//setup middleware
app.use(cors());
app.use(express.json());

//PORT setup
const PORT = process.env.PORT || 3000;

//DB connection

mongoose.connect(
  "mongodb://localhost:27017",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: true,
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

app.get("/", (req, res) => {
  res.json({ message: "Hi" });
});

app.get("/tweet", async (req, res) => {
  let username = req.query.name;
  let tag = "#" + req.query.tags;
  let tweets;
  try {
    if (tag) {
      tweets = await Tweet.find({ tags: tag }).exec();
    } else if (username) {
      tweets = await Tweet.find({ username: username }).exec();
    } else {
      tweets = await Tweet.find({}).exec();
    }
    res.json(tweets);
  } catch (err) {
    res.json({ err });
  }
});

app.post("/tweet", async (req, res) => {
  if (isValidTweet(req.body)) {
    let username = req.body.username.toString();
    let content = req.body.content.toString();
    let tags = tagParser(content);

    let tweet = await Tweet.create({
      username,
      content,
      tags,
    });
    res.json(tweet);
  } else {
    res.status(400);
    res.json({ message: "invalid request" });
  }
});

app.listen(PORT, () => console.log(`listening on port ${PORT}...`));
