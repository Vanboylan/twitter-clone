const mongoose = require("mongoose");

//DB Schema
const Schema = mongoose.Schema;
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
    likes: Array,
    retweets: Array,
    photo: {
      data: Buffer,
      contentType: String,
      code: String,
      photoExists: Boolean,
    },
  },
  { timestamps: true }
);

const Tweet = mongoose.model("Tweet", TweetSchema);

module.exports = Tweet;
