const Tweet = require("../models/tweet");
const Comment = require("../models/comment");
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
      .populate("comments")
      .populate({ path: "comments", populate: { path: "user" } });
  },
  New: (req, res) => {
    let session = req.session.user;
    res.render("tweets/new", { user: session });
  },
  Create: (req, res) => {
    let session = req.session.user;
    const tweet = new Tweet(req.body);
    tweet.save((err) => {
      if (err) {
        throw err;
      }
      res.status(201).redirect(req.get("referer"));
    });
  },
  Like: (req, res) => {
    let session = req.session.user;
    const id = req.params.id;
    Tweet.findById(id, (err, tweet) => {
      if (tweet.likes.includes(session._id)) {
        return res.status(201).redirect(req.get("referer"));
      }
      if (err) {
        throw err;
      }
      tweet.likes.push(session._id);
      tweet.save((err) => {
        if (err) {
          throw err;
        }
        res.status(201).redirect(req.get("referer"));
      });
    });
  },
  Comment: (req, res) => {
    let session = req.session.user;
    const id = req.params.id;
    const comment = new Comment(req.body);
    comment.user = session._id;
    comment.save((err) => {
      if (err) {
        throw err;
      }
      Tweet.findById(id, (err, tweet) => {
        if (err) {
          throw err;
        }
        tweet.comments.push(comment._id);
        tweet.save((err) => {
          if (err) {
            throw err;
          }
          res.status(201).redirect.get("referer");
        });
      });
    });
  },
};

module.exports = TweetsController;