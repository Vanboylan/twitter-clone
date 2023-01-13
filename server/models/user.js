const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  dob: { type: Date, required: true, trim: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, min: 6 },
  followers: Array,
  following: Array,
  tweets: Array,
  blocked: Array,
});

UserSchema.methods.checkPassword = function (userPassword) {
  return this.password === userPassword;
};

UserSchema.methods.checkAge = function (userDOB) {
  let today = new Date();
  let birthDate = new Date(userDOB);
  if (today - birthDate < 18 * 365 * 24 * 60 * 60 * 1000) {
    return false;
  } else {
    return true;
  }
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
