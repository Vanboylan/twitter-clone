const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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

//DB Schema
const TweetSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [String],
  },
  { timestamps: true }
);

const Tweet = mongoose.model("Tweet", TweetSchema);

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
