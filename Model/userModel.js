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
  photoUrl: String,
  image: {
    type: String,
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