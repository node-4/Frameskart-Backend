const User = require("../Model/userModel");
const dotenv = require("dotenv");
require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const router = express.Router();
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const config = require("config");
const randomatic = require("randomatic");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dtijhcmaa",
  api_key: "624644714628939",
  api_secret: "tU52wM1-XoaFD2NrHbPrkiVKZvY",
});

exports.loginUser = async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    let user = await User.findOne({ mobileNumber });

    if (!user) {
      const otp = randomatic("0", 4);
      user = new User({
        mobileNumber,
        otp,
      });
      await user.save();
      res.json({ message: "OTP generated and sent to the user", user });
    } else {
      const otp = randomatic("0", 4);
      user.otp = otp;
      user.isVerified = false;
      await user.save();
      res.json({ message: "New OTP generated and sent to the user", user });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.verifyOtplogin = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;
    const user = await User.findOne({ mobileNumber });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (otp === user.otp) {
      const token = jwt.sign({ id: user._id }, "node5flyweis");
      user.otp = undefined;
      user.isVerified = true;
      await user.save();

      res.json({ message: "OTP verification successful.", user, token });
    } else {
      res.status(401).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserDetails = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(404).send({ status: 404, message: "user not found ", data: {}, });
      } else {
        res.status(200).send({ status: 200, message: "get profile ", data: user, });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };