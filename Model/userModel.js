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
  name: {
    type: String,
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  userType: {
    type: String,
    enum: ["User", "Admin","Vendor"],
    default: "User"
  },
  
  photoUrl: String,
  image: {
    type: String,
  },
  photo: {
    type: String,
    default:
      "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
  },},
  { timestamps: true }
  
);

module.exports = mongoose.model("User", userSchema);