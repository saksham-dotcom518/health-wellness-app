const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    height: {
      type: Number,
      default: 170,
    },

    weight: {
      type: Number,
      default: 70,
    },

    age: {
      type: Number,
      default: 25,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);