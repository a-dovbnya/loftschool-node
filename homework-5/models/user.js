const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Укажите login"],
    unique: true
  },
  hash: {
    type: String,
    required: [true, "Укажите пароль"]
  },
  firstName: {
    type: String,
    default: ""
  },
  surName: {
    type: String,
    default: ""
  },
  access_token: {
    type: String,
    default: null
  },
  updatedAt: {
    type: String,
    default: null
  },
  createdAt: {
    type: String,
    default: null
  },
  permissionId: {
    type: String,
    required: true,
    unique: true
  },
  middleName: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  permission: {
    chat: {
      C: { type: Boolean, default: false, required: true },
      D: { type: Boolean, default: false, required: true },
      R: { type: Boolean, default: true, required: true },
      U: { type: Boolean, default: true, required: true }
    },
    news: {
      C: { type: Boolean, default: false, required: true },
      D: { type: Boolean, default: false, required: true },
      R: { type: Boolean, default: true, required: true },
      U: { type: Boolean, default: false, required: true }
    },
    setting: {
      C: { type: Boolean, default: false, required: true },
      D: { type: Boolean, default: false, required: true },
      R: { type: Boolean, default: false, required: true },
      U: { type: Boolean, default: false, required: true }
    }
  }
});

module.exports = mongoose.model("User", userSchema);
