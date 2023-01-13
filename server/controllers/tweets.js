const Tweet = require("../models/tweet");
const Comment = require("../models/comment");
const User = require("../models/user");
const path = require("path");

let appDir = path.dirname(require.main.filename);
appDir = appDir.replace("bin", "").replace("controllers", "");

const TweetsController = {
  Index: (req, res) => {
    let session = req.session.user;
    Tweet.find((err, tweets) => {
      if (err) {
        throw err;
      }
      res.render("tweets/index", {
        tweets: tweets.reverse(),
        user: session,
      });
    })
      .populate("user")
      .populate({
        path: "comments",
        options: { limit: 10, sort: { created: -1 } },
      })
      .populate({ path: "comments", populate: { path: "user" } });
  },
  New: (req, res) => {
    let session = req.session.user;
    res.render("tweets/new", { user: session });
  },
  Create: (req, res) => {
    let session = req.session.user;
    const tweet = new Tweet(req.body);
    tweet.user = session._id;
    console.log(tweet);
    tweet.save((err) => {
      if (err) {
        throw err;
      }
      res.status(201).redirect(req.get("referer"));
    });
  },
  Comment: (req, res) => {
    let session = req.session.user;
    let id = req.params.id;
    const comment = new Comment(req.body);
    comment.user = session._id;
    comment.save((err) => {
      if (err) {
        throw err;
      }
    });
    Tweet.findById(id, (err, tweet) => {
      if (err) {
        throw err;
      }
      tweet.comments.push(comment._id);
      tweet.save((err) => {
        if (err) {
          throw err;
        }
        res.status(201).redirect(req.get("referer"));
      });
    });
  },
  View: (req, res) => {
    let session = req.session.user;
    let id = req.params.id;
    Tweet.findById(id, (err, tweet) => {
      if (err) {
        throw err;
      }
      res.render("tweets/:id", {
        user: session,
        tweet: tweet,
      });
    })
      .populate("user")
      .populate({ path: "comments", populate: { path: "user" } });
  },
};

module.exports = TweetsController;
