const mongoose = require("mongoose");

//DB Schema
const Schema = mongoose.Schema;
const TweetSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
      index: true,
    },
    tags: [String],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    retweets: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
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
