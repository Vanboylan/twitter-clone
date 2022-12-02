const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date, required: true, trim: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, min: 6 },
  followers: [{ type: Schema.Types.ObjectId, ref: "User", unique: true }],
  following: [{ type: Schema.Types.ObjectId, ref: "User", unique: true }],
  tweets: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  blocked: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
