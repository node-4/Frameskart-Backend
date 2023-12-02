const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
  },
  otp: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  mobileNumber: {
    type: String
  },
  socialId: {
    type: String
  },
  socialType: {
    type: String
  },
  password: {
    type: String
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  userType: {
    type: String,
    enum: ["User", "Admin", "Vendor"],
    default: "User"
  },
  isWhatApp: {
    type: Boolean,
    default: false,
  },
  whatAppnotification: {
    type: Boolean,
    default: false,
  },
  smsNotification: {
    type: Boolean,
    default: false,
  },
  pushNotification: {
    type: Boolean,
    default: false,
  },
  emailNotification: {
    type: Boolean,
    default: false,
  },
  refferalCode: { type: String, },
  refferUserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  joinUser: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  subscriptionId: { type: mongoose.Schema.ObjectId, ref: "subscription", },
  wallet: {
    type: Number,
    default: 0,
  },
  esCash: {
    type: Number,
    default: 0,
  },
  photo: {
    type: String,
    default:
      "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
  },
},
  { timestamps: true }

);

module.exports = mongoose.model("User", userSchema);