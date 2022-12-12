var mongoose = require("mongoose");
var User = require("../models/user");
var Post = require("../models/tweet");

module.exports = (on) => {
  on("task", {
    async resetDb() {
      mongoose.connect("mongodb://127.0.0.1/twitter_test", {});

      let db = mongoose.connection;

      db.on("error", console.error.bind(console, "MongoDB connection error:"));

      //open is Emitted after 'connected' and 'onOpen' is executed on all of this connection's models.
      // It means we can now work against these models on the database
      // https://mongoosejs.com/docs/connections.html
      db.on("open", function () {
        User.deleteMany({})
          .then(() => {
            console.log("User Test Data Deleted");
          })
          .catch(function (error) {
            console.log(error);
          });

        Tweet.deleteMany({})
          .then(function () {
            console.log("Post Test Data Deleted");
          })
          .catch(function (error) {
            console.log(error);
          });
      });
      return null;
    },
  });

  on("task", {
    async closeDbConnection() {
      mongoose.connection.close(() => {
        console.log("Database Connection Closed");
      });

      return null;
    },
  });
};
