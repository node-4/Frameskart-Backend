require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const randomatic = require("randomatic");
const User = require("../Model/userModel");
const feedback = require("../Model/feedback");
const eyeTestCamp = require("../Model/eyeTestCamp");
const franchiseInquiry = require("../Model/FranchiseRegistration/franchiseInquiry");
const franchise = require("../Model/FranchiseRegistration/franchise");
const franchiseTestimonial = require("../Model/FranchiseRegistration/franchiseTestimonial");
const product = require('../Model/productModel');
const Wishlist = require("../Model/whishList");
exports.socialLogin = async (req, res) => {
  try {
    let userData = await User.findOne({ $or: [{ mobileNumber: req.body.mobileNumber }, { socialId: req.body.socialId }, { socialType: req.body.socialType }] });
    if (userData) {
      let updateResult = await User.findByIdAndUpdate({ _id: userData._id }, { $set: { deviceToken: req.body.deviceToken } }, { new: true });
      if (updateResult) {
        const token = jwt.sign({ id: updateResult._id }, "node5flyweis");
        let obj = {
          _id: updateResult._id,
          firstName: updateResult.firstName,
          lastName: updateResult.lastName,
          socialId: updateResult.socialId,
          userType: updateResult.userType,
          token: token
        }
        return res.status(200).send({ status: 200, message: "Login successfully ", data: obj, });
      }
    } else {
      req.body.firstName = req.body.firstName;
      req.body.lastName = req.body.lastName;
      req.body.mobileNumber = req.body.mobileNumber;
      let email = req.body.email;
      req.body.email = email.split(" ").join("").toLowerCase();
      req.body.socialId = req.body.socialId;
      req.body.socialType = req.body.socialType;
      let saveUser = await User(req.body).save();
      if (saveUser) {
        const token = jwt.sign({ id: saveUser._id }, "node5flyweis");
        let obj = {
          _id: saveUser._id,
          firstName: saveUser.firstName,
          lastName: saveUser.lastName,
          mobileNumber: saveUser.mobileNumber,
          userType: saveUser.userType,
          token: token
        }
        return res.status(200).send({ status: 200, message: "Login successfully ", data: obj, });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { mobileNumber, isWhatApp } = req.body;
    let user = await User.findOne({ mobileNumber });
    if (!user) {
      const otp = randomatic("0", 4);
      user = new User({ mobileNumber, otp, isWhatApp });
      await user.save();
      return res.status(200).send({ status: 200, message: "OTP generated and sent to the user.", data: user, });
    } else {
      const otp = randomatic("0", 4);
      user.otp = otp;
      user.isVerified = false;
      user.isWhatApp = isWhatApp;
      await user.save();
      return res.status(200).send({ status: 200, message: "OTP generated and sent to the user.", data: user, });
    }
  } catch (error) {
    return res.status(500).send({ status: 500, message: "Server error" + error.message });
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
      return res.status(200).send({ status: 200, message: "OTP verification successful", data: { user, token }, });
    } else {
      return res.status(401).send({ status: 401, message: "Invalid OTP", data: {}, });
    }
  } catch (error) {
    return res.status(500).send({ status: 500, message: "Server error" + error.message });
  }
};
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ status: 404, message: "user not found ", data: {}, });
    } else {
      return res.status(200).send({ status: 200, message: "get profile ", data: user, });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.giveFeedback = async (req, res) => {
  try {
    let { feedBack, } = req.body;
    const userData = await User.findById({ _id: req.user._id });
    if (!userData) {
      return res.status(404).send({ status: 404, message: "user not found ", data: {}, });
    } else {
      const data = { userId: req.user._id, feedBack: feedBack, }
      const NewUserFeedback = await feedback.create(data);
      if (NewUserFeedback) {
        return res.status(200).json({ message: "UserFeedback Send", data: NewUserFeedback, status: true, });
      }
    }
  } catch (error) {
    return res.status(400).json({ message: error.message, status: false });
  }
};
exports.GetAllFeedBack = async (req, res) => {
  try {
    const data = await feedback.find();
    if (data.length == 0) {
      return res.status(404).json({ status: 404, message: "No data found", data: {} });
    }
    return res.status(200).json({ status: 200, message: "feedback retrieved successfully ", data: data });
  } catch (err) {
    console.log(err);
    return res.status(501).send({ status: 501, message: "server error.", data: {}, });
  }
}
exports.GetFeedbackById = async (req, res) => {
  const { id } = req.params;
  try {
    const faq = await feedback.findById(id);
    if (!faq) {
      return res.status(404).json({ status: 404, message: "No data found", data: {} });
    }
    return res.status(200).json({ status: 200, message: "feedback retrieved successfully ", data: faq });
  } catch (err) {
    console.log(err);
    return res.status(501).send({ status: 501, message: "server error.", data: {}, });
  }
};
exports.applyforEyeTestCamp = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ status: 404, message: "user not found ", data: {}, });
    } else {
      req.body.type = "form";
      let saveUser = await eyeTestCamp(req.body).save();
      if (saveUser) {
        return res.status(200).send({ status: 200, message: "Request send for eyeTest camp ", data: saveUser, });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.applyforFranchiseInquiry = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ status: 404, message: "user not found ", data: {}, });
    } else {
      let saveUser = await franchiseInquiry(req.body).save();
      if (saveUser) {
        return res.status(200).send({ status: 200, message: "Request send for franchiseInquiry ", data: saveUser, });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.createWishlist = async (req, res, next) => {
  try {
          const productId = req.params.id;
          const viewProduct = await product.findById(productId);
          let wishList = await Wishlist.findOne({ user: req.user._id });
          if (!wishList) {
                  wishList = new Wishlist({ user: req.user._id, });
          }
          wishList.products.addToSet(productId);
          viewProduct.Wishlistuser.addToSet(req.user._id);
          await wishList.save();
          await viewProduct.save();
          return res.status(200).json({ status: 200, message: "product add to wishlist Successfully", });
  } catch (error) {
          console.log(error);
          return res.status(501).send({ status: 501, message: "server error.", data: {}, });
  }
};
exports.removeFromWishlist = async (req, res, next) => {
  try {
          const wishlist = await Wishlist.findOne({ user: req.user._id });
          if (!wishlist) {
                  return res.status(404).json({ message: "Wishlist not found", status: 404 });
          }
          const productId = req.params.id;
          const viewProduct = await product.findById(productId);
          wishlist.products.pull(productId);
          viewProduct.Wishlistuser.pull(req.user._id);
          await wishlist.save();
          await viewProduct.save();
          return res.status(200).json({ status: 200, message: "Removed From Wishlist", });
  } catch (error) {
          console.log(error);
          return res.status(501).send({ status: 501, message: "server error.", data: {}, });
  }
};
exports.myWishlist = async (req, res, next) => {
  try {
          let myList = await Wishlist.findOne({ user: req.user._id }).populate('products');
          if (!myList) {
                  myList = await Wishlist.create({ user: req.user._id });
          }
          let array = []
          for (let i = 0; i < myList.products.length; i++) {
                  const data = await product.findById(myList.products[i]._id).populate('categoryId subcategoryId').populate('colors')
                  array.push(data)
          }
          let obj = {
                  _id: myList._id,
                  user: myList.user,
                  products: array,
                  __v: myList.__v
          }

          return res.status(200).json({ status: 200, wishlist: obj, });
  } catch (error) {
          console.log(error);
          return res.status(501).send({ status: 501, message: "server error.", data: {}, });
  }
};