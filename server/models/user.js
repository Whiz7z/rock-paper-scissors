const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true, minLength: 4 },
    winrate: {
      wins: { type: Number, default: 0 },
      loses: { type: Number, default: 0 },
    },
  },
  { collection: "Users" }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
