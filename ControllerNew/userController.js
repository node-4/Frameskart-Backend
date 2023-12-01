const express = require("express");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const randomatic = require("randomatic");
const User = require("../ModelNew/userModel");
const feedback = require("../ModelNew/feedback");
const eyeTestCamp = require("../ModelNew/eyeTestCamp");
const franchiseInquiry = require("../ModelNew/FranchiseRegistration/franchiseInquiry");
const franchise = require("../ModelNew/FranchiseRegistration/franchise");
const franchiseTestimonial = require("../ModelNew/FranchiseRegistration/franchiseTestimonial");
const savePower = require("../ModelNew/savePower");
const helpandSupport = require('../ModelNew/helpAndSupport');
const notification = require("../ModelNew/notification");
const Address = require("../ModelNew/Address");
const transaction = require('../ModelNew/transactionModel');
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
      req.body.refferalCode = await reffralCode();
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
      let refferalCode = await reffralCode();
      user = new User({ mobileNumber, otp, refferalCode, isWhatApp });
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
exports.updateWhatAppnotificationStatus = async (req, res) => {
  try {
    const findUser = await User.findById({ _id: req.user._id });
    if (findUser) {
      if (findUser.whatAppnotification == true) {
        const data = await User.findOneAndUpdate({ _id: req.user._id }, { $set: { whatAppnotification: false } }, { new: true });
        return res.status(200).json({ success: true, details: data })
      } else {
        const data = await User.findOneAndUpdate({ _id: req.user._id }, { $set: { whatAppnotification: true } }, { new: true });
        return res.status(200).json({ success: true, details: data })
      }
    } else {
      return res.status(201).json({ status: 404, message: "User not found" })
    }
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
}
exports.updateSmsNotificationStatus = async (req, res) => {
  try {
    const findUser = await User.findById({ _id: req.user._id });
    if (findUser) {
      if (findUser.smsNotification == true) {
        const data = await User.findOneAndUpdate({ _id: req.user._id }, { $set: { smsNotification: false } }, { new: true });
        return res.status(200).json({ success: true, details: data })
      } else {
        const data = await User.findOneAndUpdate({ _id: req.user._id }, { $set: { smsNotification: true } }, { new: true });
        return res.status(200).json({ success: true, details: data })
      }
    } else {
      return res.status(201).json({ status: 404, message: "User not found" })
    }
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
}
exports.updatepushNotificationStatus = async (req, res) => {
  try {
    const findUser = await User.findById({ _id: req.user._id });
    if (findUser) {
      if (findUser.pushNotification == true) {
        const data = await User.findOneAndUpdate({ _id: req.user._id }, { $set: { pushNotification: false } }, { new: true });
        return res.status(200).json({ success: true, details: data })
      } else {
        const data = await User.findOneAndUpdate({ _id: req.user._id }, { $set: { pushNotification: true } }, { new: true });
        return res.status(200).json({ success: true, details: data })
      }
    } else {
      return res.status(201).json({ status: 404, message: "User not found" })
    }
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
}
exports.updateEmailNotificationStatus = async (req, res) => {
  try {
    const findUser = await User.findById({ _id: req.user._id });
    if (findUser) {
      if (findUser.emailNotification == true) {
        const data = await User.findOneAndUpdate({ _id: req.user._id }, { $set: { emailNotification: false } }, { new: true });
        return res.status(200).json({ success: true, details: data })
      } else {
        const data = await User.findOneAndUpdate({ _id: req.user._id }, { $set: { emailNotification: true } }, { new: true });
        return res.status(200).json({ success: true, details: data })
      }
    } else {
      return res.status(201).json({ status: 404, message: "User not found" })
    }
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
}
exports.addPower = async (req, res, next) => {
  try {
    const cart = await savePower.findOne({ user: req.user._id })
    if (!cart) {
      req.body.user = req.user._id;
      const newPrescription = new savePower(req.body);
      const savedPrescription = await newPrescription.save();
      return res.status(200).json({ message: "Power Save successfully.", status: 200, data: savedPrescription });
    } else {
      const updatedPrescriptionData = {
        odRightSpherer: req.body.odRightSpherer || cart.odRightSpherer,
        odRightCylinder: req.body.odRightCylinder || cart.odRightCylinder,
        odRightAxis: req.body.odRightAxis || cart.odRightAxis,
        osLeftSpherer: req.body.osLeftSpherer || cart.osLeftSpherer,
        osLeftCylinder: req.body.osLeftCylinder || cart.osLeftCylinder,
        osLeftAxis: req.body.osLeftAxis || cart.osLeftAxis,
        bifocalPower: req.body.bifocalPower || cart.bifocalPower,
        biodRightSpherer: req.body.biodRightSpherer || cart.biodRightSpherer,
        biodRightCylinder: req.body.biodRightCylinder || cart.biodRightCylinder,
        biodRightAxis: req.body.biodRightAxis || cart.biodRightAxis,
        biosLeftSpherer: req.body.biosLeftSpherer || cart.biosLeftSpherer,
        biosLeftCylinder: req.body.biosLeftCylinder || cart.biosLeftCylinder,
        biosLeftAxis: req.body.biosLeftAxis || cart.biosLeftAxis,
      };
      const savedPrescription = await savePower.findOneAndUpdate({ _id: cart._id }, { $set: updatedPrescriptionData }, { new: true });
      return res.status(200).json({ message: "Power Save successfully.", status: 200, data: savedPrescription });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getPower = async (req, res, next) => {
  try {
    const cart = await savePower.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: "Power not found.", status: 404, data: {} });
    } else {
      return res.status(200).json({ message: "Power Save successfully.", status: 200, data: cart });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.AddQuery = async (req, res) => {
  try {
    const data = await User.findOne({ _id: req.user._id, });
    if (data) {
      const data1 = {
        user: data._id,
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        query: req.body.query
      }
      const Data = await helpandSupport.create(data1);
      return res.status(200).json({ status: 200, message: "Send successfully.", data: Data })
    } else {
      return res.status(404).json({ status: 404, message: "No data found", data: {} });
    }
  } catch (err) {
    console.log(err);
    return res.status(501).send({ status: 501, message: "server error.", data: {}, });
  }
};
exports.getAllQuery = async (req, res) => {
  try {
    const data = await User.findOne({ _id: req.user._id, });
    if (data) {
      const Data = await helpandSupport.find({ user: req.user._id });
      if (data.length == 0) {
        return res.status(404).json({ status: 404, message: "Help and support data not found", data: {} });
      } else {
        return res.status(200).json({ status: 200, message: "Data found successfully.", data: Data })
      }
    } else {
      return res.status(404).json({ status: 404, message: "No data found", data: {} });
    }
  } catch (err) {
    console.log(err);
    return res.status(501).send({ status: 501, message: "server error.", data: {}, });
  }
};
exports.createAddress = async (req, res, next) => {
  try {
    const data = await User.findOne({ _id: req.user._id, });
    if (data) {
      if (req.body.default == true) {
        const findData = await Address.findOne({ user: data._id, default: true });
        if (findData) {
          let update = await Address.findByIdAndUpdate({ _id: findData._id }, { $set: { default: false } }, { new: true, });
        }
      }
      req.body.user = data._id;
      const address = await Address.create(req.body);
      return res.status(200).json({ message: "Address create successfully.", data: address });
    } else {
      return res.status(404).json({ status: 404, message: "No data found", data: {} });
    }
  } catch (error) {
    console.log(error);
    return res.status(501).send({ status: 501, message: "server error.", data: {}, });
  }
};
exports.getallAddress = async (req, res, next) => {
  try {
    const data = await User.findOne({ _id: req.user._id, });
    if (data) {
      const allAddress = await Address.find({ user: data._id });
      return res.status(200).json({ message: "Address data found.", data: allAddress });
    } else {
      return res.status(404).json({ status: 404, message: "No data found", data: {} });
    }
  } catch (error) {
    console.log(error);
    return res.status(501).send({ status: 501, message: "server error.", data: {}, });
  }
};
exports.updateAddress = async (req, res, next) => {
  try {
    const data = await User.findOne({ _id: req.user._id, });
    if (data) {
      const data1 = await Address.findById({ _id: req.params.id });
      if (data1) {
        if (req.body.default != (null || undefined)) {
          if (req.body.default == true) {
            const findData = await Address.findOne({ user: data._id, _id: { $ne: data1._id }, default: true });
            if (findData) {
              let update = await Address.findByIdAndUpdate({ _id: findData._id }, { $set: { default: false } }, { new: true, });
            }
          }
        }
        const newAddressData = req.body;
        let update = await Address.findByIdAndUpdate({ _id: data1._id }, { $set: newAddressData }, { new: true, });
        return res.status(200).json({ status: 200, message: "Address update successfully.", data: update });
      } else {
        return res.status(404).json({ status: 404, message: "No data found", data: {} });
      }
    } else {
      return res.status(404).json({ status: 404, message: "No data found", data: {} });
    }
  } catch (error) {
    console.log(error);
    return res.status(501).send({ status: 501, message: "server error.", data: {}, });
  }
};
exports.deleteAddress = async (req, res, next) => {
  try {
    const data = await User.findOne({ _id: req.user._id, });
    if (data) {
      const data1 = await Address.findById({ _id: req.params.id });
      if (data1) {
        let update = await Address.findByIdAndDelete(data1._id);
        return res.status(200).json({ status: 200, message: "Address Deleted Successfully", });
      } else {
        return res.status(404).json({ status: 404, message: "No data found", data: {} });
      }
    } else {
      return res.status(404).json({ status: 404, message: "No data found", data: {} });
    }
  } catch (error) {
    console.log(error);
    return res.status(501).send({ status: 501, message: "server error.", data: {}, });
  }
};
exports.getAddressbyId = async (req, res, next) => {
  try {
    const data = await User.findOne({ _id: req.user._id, });
    if (data) {
      const data1 = await Address.findById({ _id: req.params.id });
      if (data1) {
        return res.status(200).json({ status: 200, message: "Address found successfully.", data: data1 });
      } else {
        return res.status(404).json({ status: 404, message: "No data found", data: {} });
      }
    } else {
      return res.status(404).json({ status: 404, message: "No data found", data: {} });
    }
  } catch (error) {
    console.log(error);
    return res.status(501).send({ status: 501, message: "server error.", data: {}, });
  }
};
exports.addMoney = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate({ _id: req.user._id }, { $inc: { wallet: parseInt(req.body.balance) } }, { new: true });
    if (updatedUser) {
      const transactionData = {
        user: req.user._id,
        date: Date.now(),
        amount: req.body.balance,
        type: "Credit",
      };
      const createdTransaction = await transaction.create(transactionData);
      const welcomeMessage = `Welcome, ${updatedUser.fullName}! Thank you for adding money to your wallet.`;
      const welcomeNotification = new notification({ recipient: updatedUser._id, content: welcomeMessage, type: 'welcome', });
      await welcomeNotification.save();
      return res.status(200).json({ status: 200, message: "Money has been added.", data: updatedUser, });
    } else {
      return res.status(404).json({ status: 404, message: "No data found", data: {}, });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Server error.",
      data: {},
    });
  }
};
exports.removeMoney = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate({ _id: req.user._id }, { $inc: { wallet: -parseInt(req.body.balance) } }, { new: true });
    if (updatedUser) {
      const transactionData = {
        user: req.user._id,
        date: Date.now(),
        amount: req.body.balance,
        type: "Debit",
      };
      const createdTransaction = await transaction.create(transactionData);
      const welcomeMessage = `Welcome, ${updatedUser.fullName}! Money has been deducted from your wallet.`;
      const welcomeNotification = new notification({
        recipient: updatedUser._id,
        content: welcomeMessage,
        type: 'welcome',
      });
      await welcomeNotification.save();
      return res.status(200).json({
        status: 200,
        message: "Money has been deducted.",
        data: updatedUser,
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "No data found",
        data: {},
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Server error.",
      data: {},
    });
  }
};
exports.getWallet = async (req, res) => {
  try {
    const data = await User.findOne({ _id: req.user._id, });
    if (data) {
      let obj = { wallet: data.wallet, esCash: data.esCash, }
      return res.status(200).json({ status: 200, message: "get wallet", data: obj });
    } else {
      return res.status(404).json({ status: 404, message: "No data found", data: {} });
    }
  } catch (error) {
    console.log(error);
    return res.status(501).send({ status: 501, message: "server error.", data: {}, });
  }
};
exports.allTransactionUser = async (req, res) => {
  try {
    const data = await transaction.find({ user: req.user._id }).populate("user");
    if (data.length == 0) {
      return res.status(404).json({ status: 404, message: "No data found", data: {} });
    }
    return res.status(200).json({ status: 200, message: "transaction retrieved successfully ", data: data });
  } catch (err) {
    console.log(err);
    return res.status(501).send({ status: 501, message: "server error.", data: {}, });
  }
};
exports.allcreditTransactionUser = async (req, res) => {
  try {
    const data = await transaction.find({ user: req.user._id, type: "Credit" });
    if (data.length == 0) {
      return res.status(404).json({ status: 404, message: "No data found", data: {} });
    }
    return res.status(200).json({ status: 200, message: "transaction retrieved successfully ", data: data });
  } catch (err) {
    console.log(err);
    return res.status(501).send({ status: 501, message: "server error.", data: {}, });
  }
};
exports.allDebitTransactionUser = async (req, res) => {
  try {
    const data = await transaction.find({ user: req.user._id, type: "Debit" });
    if (data.length == 0) {
      return res.status(404).json({ status: 404, message: "No data found", data: {} });
    }
    return res.status(200).json({ status: 200, message: "transaction retrieved successfully ", data: data });
  } catch (err) {
    console.log(err);
    return res.status(501).send({ status: 501, message: "server error.", data: {}, });
  }
};
exports.transferAllEcashToWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ status: 404, message: "user not found ", data: {}, });
    } else {
      let cash = user.esCash;
      let update = await User.findByIdAndUpdate({ _id: user._id }, { $set: { wallet: user.wallet + cash, esCash: 0 } }, { new: true });
      return res.status(200).send({ status: 200, message: "Ecash transfer to wallet ", data: update, });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}
const reffralCode = async () => {
  var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let OTP = '';
  for (let i = 0; i < 9; i++) {
    OTP += digits[Math.floor(Math.random() * 36)];
  }
  return OTP;
}