const User = require("../models/user");

const SessionsController = {
  New: (req, res) => {
    res.render("sessions/new");
  },
  Create: (req, res) => {
    console.log("Login attempted");
    const nameInput = req.body.username.toLowerCase();
    const password = req.body.password;
    if (nameInput.includes("@")) {
      User.findOne({ email: nameInput }).then((user) => {
        if (!user) {
          res.redirect("/sessions/new");
        } else if (!user.checkPassword(password)) {
          console.log("Password incorrect user found - email route");
          res.redirect("sessions/new");
        } else {
          console.log("password correct");
          req.session.user = user;
          res.redirect("/tweets");
        }
      });
    } else {
      User.findOne({ username: nameInput }).then((user) => {
        if (!user) {
          console.log("not a registered user");
          res.redirect("/sessions/new");
        } else if (!user.checkPassword(password)) {
          console.log("password incorrect but user found");
          res.redirect("sessions/new");
        } else {
          console.log("password correct");
          req.session.user = user;
          res.redirect("/tweets");
        }
      });
    }
  },
  Destroy: (req, res) => {
    console.log("log out initiated");
    if (req.session.user && req.cookies.user_sid) {
      res.clearCookie("user_sid");
    }
    res.redirect("/");
  },
};

module.exports = SessionsController;
