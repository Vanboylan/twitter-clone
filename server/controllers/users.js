const User = require("../models/user");
const Tweet = require("../models/tweet");
const path = require("path");

let appDir = path.dirname(require.main.filename);
appDir = appDir.replace("bin", "").replace("controllers", "");

const UsersController = {
  Create: (req, res) => {
    const user = new User(req.body);
    user.username = req.body.username.toLowerCase();
    user.email = req.body.email.toLowerCase();
    user.dob = req.body.birthday;
    user.save((err) => {
      if (err) {
        throw err;
      }
      res.status(201).redirect("/sessions/new");
    });
  },
  New: (req, res) => {
    res.render("users/new");
  },
  ViewMyProfile: (req, res) => {
    let session = req.session.user;
    Tweet.find({ user: session._id }, (err, tweets) => {
      if (err) {
        throw err;
      }
      res.render("users/index", { tweets: tweets.reverse(), user: session });
    })
      .populate("user")
      .populate("comments")
      .populate({ path: "comments", populate: { path: user } })
      .populate("followers")
      .populate("following");
  },
  ViewProfile: (req, res) => {
    const id = req.params.id;
    if (id === req.session.user) {
      res.render("/index");
    } else {
      Tweet.find({ user: id }, (err, tweets) => {
        if (err) {
          throw err;
        }
        res.render("users/:id", { tweets: tweets.reverse(), user: id });
      })
        .populate("user")
        .populate("comments")
        .populate({ path: "comments", populate: { path: "user" } })
        .populate("followers")
        .populate("following");
    }
  },
  Follow: (req, res) => {
    let session = req.session.user;
    let id = req.params.id;
    User.find({ user: id }, (err, user) => {
      if (err) {
        throw err;
      }
      if (user.followers.includes(session._id)) {
        console.log("already following");
      } else {
        user.followers.push(session._id);
      }
      user.save((err) => {
        if (err) {
          throw err;
        }
        res.status(201).get("referer");
      });
    });
  },
};

module.exports = UsersController;
