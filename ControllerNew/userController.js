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
const visionTestQuestion = require("../ModelNew/visionTest/visionTestQuestion");
const Subscription = require("../ModelNew/subscription");
const product = require("../ModelNew/productModel");
const cartModel = require("../ModelNew/cartModel");
const Wishlist = require("../ModelNew/whishList");
const recentlyView = require("../ModelNew/recentlyView");
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
exports.giveAnswerVisionTest = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ status: 404, message: "User not found", data: {} });
    } else {
      const visionTestId = req.params.visionTestId;
      const userAnswers = req.body.userAnswers;
      const questions = await visionTestQuestion.find({ visionTestId });
      if (userAnswers.length !== questions.length) {
        return res.status(400).json({ status: 400, message: "Invalid number of answers provided." });
      }
      const correctAnswers = questions.reduce((acc, question, index) => {
        let x = index;
        let a = ((question.answer == req.body.userAnswers[x].userAnswer) ? 1 : 0);
        return acc + a;
      }, 0);
      const totalQuestions = questions.length;
      const percentage = (correctAnswers / totalQuestions) * 100;
      return res.status(200).json({ status: 200, message: "Correct answer percentage.", data: Number(percentage.toFixed(2)), });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.getSubscription = async (req, res) => {
  try {
    const findSubscription = await Subscription.find();
    return res.status(200).json({ status: 200, message: "Subscription detail successfully.", data: findSubscription });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.getSubscriptionApp = async (req, res) => {
  try {
    const data = await User.findOne({ _id: req.user._id, isSubscription: true });
    if (data) {
      const findSubscription = await Subscription.find();
      const modifiedSubscriptions = findSubscription.map(sub => {
        return {
          ...sub.toObject(),
          isUserSubscribed: sub._id.equals(data.subscriptionId),
        };
      });
      return res.status(200).json({ status: 200, message: "Subscription detail successfully.", data: modifiedSubscriptions, });
    } else {
      const findSubscription = await Subscription.find();
      const modifiedSubscriptions = findSubscription.map(sub => {
        return {
          ...sub.toObject(),
          isUserSubscribed: false,
        };
      });
      return res.status(200).json({ status: 200, message: "Subscription detail successfully.", data: modifiedSubscriptions, });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.takeSubscription = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id, });
    if (!user) {
      return res.status(404).send({ status: 404, message: "User not found" });
    } else {
      let id = req.params.id;
      const findSubscription = await Subscription.findById(id);
      if (findSubscription) {
        const findTransaction = await transaction.findOne({ user: user._id, type: "Subscription", Status: "pending" });
        if (findTransaction) {
          let deleteData = await transaction.findByIdAndDelete({ _id: findTransaction._id })
          let obj = {
            user: user._id,
            subscriptionId: findSubscription._id,
            amount: findSubscription.price,
            paymentMode: req.body.paymentMode,
            type: "Subscription",
            Status: "pending",
          }
          let update = await transaction.create(obj);
          if (update) {
            return res.status(200).send({ status: 200, message: "update successfully.", data: update });
          }
        } else {
          let obj = {
            user: user._id,
            subscriptionId: findSubscription._id,
            amount: findSubscription.price,
            paymentMode: req.body.paymentMode,
            type: "Subscription",
            Status: "pending",
          }
          let update = await transaction.create(obj);
          if (update) {
            return res.status(200).send({ status: 200, message: "update successfully.", data: update });
          }
        }
      } else {
        return res.status(404).send({ status: 404, message: "Subscription not found" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 500, message: "Server error" + error.message });
  }
};
exports.takeSubscriptionFromWebsite = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id, });
    if (!user) {
      return res.status(404).send({ status: 404, message: "User not found" });
    } else {
      let id = req.params.id;
      const findSubscription = await Subscription.findById(id);
      if (findSubscription) {
        const findTransaction = await transaction.findOne({ user: user._id, type: "Subscription", Status: "pending" });
        if (findTransaction) {
          let deleteData = await transaction.findByIdAndDelete({ _id: findTransaction._id })
          let obj = {
            user: user._id,
            subscriptionId: findSubscription._id,
            amount: findSubscription.price,
            paymentMode: req.body.paymentMode,
            type: "Subscription",
            Status: "pending",
          }
          let update = await transaction.create(obj);
          if (update) {
            let line_items = [];
            let obj2 = {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `${findSubscription.plan} Subscription`,
                },
                unit_amount: `${Math.round(findSubscription.price * 100)}`,
              },
              quantity: 1,
            }
            line_items.push(obj2)
            const session = await stripe.checkout.sessions.create({
              payment_method_types: ["card"],
              success_url: `https://shahina-web.vercel.app/verifySubscription/${update._id}`,
              cancel_url: `https://shahina-web.vercel.app/faildeSub/${update._id}`,
              customer_email: req.user.email,
              client_reference_id: update._id,
              line_items: line_items,
              mode: "payment",
            });
            return res.status(200).json({ status: "success", session: session, });
          }
        } else {
          let obj = {
            user: user._id,
            subscriptionId: findSubscription._id,
            amount: findSubscription.price,
            paymentMode: req.body.paymentMode,
            type: "Subscription",
            Status: "pending",
          }
          let update = await transaction.create(obj);
          if (update) {
            let line_items = [];
            let obj2 = {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `${findSubscription.plan} Subscription`,
                },
                unit_amount: `${Math.round(findSubscription.price * 100)}`,
              },
              quantity: 1,
            }
            line_items.push(obj2)
            const session = await stripe.checkout.sessions.create({
              payment_method_types: ["card"],
              success_url: `https://shahina-web.vercel.app/verifySubscription/${update._id}`,
              cancel_url: `https://shahina-web.vercel.app/faildeSub/${update._id}`,
              customer_email: req.user.email,
              client_reference_id: update._id,
              line_items: line_items,
              mode: "payment",
            });
            return res.status(200).json({ status: "success", session: session, });
          }
        }
      } else {
        return res.status(404).send({ status: 404, message: "Subscription not found" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 500, message: "Server error" + error.message });
  }
};
exports.verifySubscription = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id, });
    if (!user) {
      return res.status(404).send({ status: 404, message: "User not found" });
    } else {
      let findTransaction = await transaction.findById({ _id: req.params.transactionId, type: "Subscription", Status: "pending", });
      if (findTransaction) {
        if (req.body.Status == "Paid") {
          let update = await transaction.findByIdAndUpdate({ _id: findTransaction._id }, { $set: { Status: "Paid" } }, { new: true });
          if (update) {
            const findSubscription = await Subscription.findById(update.subscriptionId);
            if (findSubscription) {
              let subscriptionExpiration = new Date(Date.now() + (findSubscription.month * 30 * 24 * 60 * 60 * 1000))
              console.log(subscriptionExpiration);
              let updateUser = await User.findByIdAndUpdate({ _id: user._id }, { $set: { subscriptionId: findTransaction.subscriptionId, isSubscription: true, subscriptionExpiration: subscriptionExpiration } }, { new: true })
              return res.status(200).send({ status: 200, message: 'subscription subscribe successfully.', data: update })
            }
          }
        }
        if (req.body.Status == "failed") {
          let update = await transaction.findByIdAndUpdate({ _id: findTransaction._id }, { $set: { Status: "failed" } }, { new: true });
          if (update) {
            return res.status(200).send({ status: 200, message: 'subscription not subscribe successfully.', data: update });
          }
        }
      } else {
        return res.status(404).send({ status: 404, message: "Transaction not found" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 500, message: "Server error" + error.message });
  }
};
exports.listProduct = async (req, res) => {
  try {
    console.log(req.user);
    const user = await User.findById(req.user._id).populate('subscriptionId');
    
    if (!user) {
      return res.status(404).send({ status: 404, message: "User not found", data: {} });
    } else {
        let query = { type: "product" };
        if (req.query.categoryId) {
          query.category = req.query.categoryId;
        }
        if (req.query.subcategoryId) {
          query.subcategory = req.query.subcategoryId;
        }
        if (req.query.gender) {
          query.gender = req.query.gender;
        }
        if (req.query.color) {
          query.color = req.query.color;
        }
        if (req.query.brand) {
          query.brand = req.query.brand;
        }
        if (req.query.shape) {
          query.shape = req.query.shape;
        }
        if (req.query.style) {
          query.style = req.query.style;
        }
        if (req.query.fromDate && !req.query.toDate) {
          query.createdAt = { $gte: req.query.fromDate };
        }
        if (!req.query.fromDate && req.query.toDate) {
          query.createdAt = { $lte: req.query.toDate };
        }
        if (req.query.fromDate && req.query.toDate) {
          query.$and = [
            { createdAt: { $gte: req.query.fromDate } },
            { createdAt: { $lte: req.query.toDate } },
          ];
        }
        var limit = parseInt(req.query.limit);
        var options = {
          page: parseInt(req.query.page) || 1,
          limit: limit || 1000,
          sort: { createdAt: 1 },
          populate: { path: 'category subcategory color gender brand shape style' },
        };
        product.paginate(query, options, (transErr, transRes) => {
          if (transErr) {
            return res.status(501).send({ message: "Internal Server error" + transErr.message });
          } else if (transRes.docs.length == 0) {
            return res.status(200).send({ status: 200, message: "Product data found successfully.", data: [] });
          } else {
            const responseData = transRes.docs.map(product => {
              const modifiedProduct = {
                ...product.toObject(),
                memberPrice: null,
              };
              if (user.isSubscription) {
                modifiedProduct.memberPrice = product.price - (product.price * user.subscriptionId.discount) / 100;
              }
              return modifiedProduct;
            });

            return res.status(200).send({
              status: 200,
              message: "Product data found successfully.",
              data: {
                ...transRes,
                docs: responseData,
              },
            });
          }
        });
      
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server error" + error.message });
  }
};
exports.newArrivalProduct = async (req, res) => {
  try {
    let query = { type: "product" };
    if (req.query.categoryId) {
      query.category = req.query.categoryId;
    }
    if (req.query.subcategoryId) {
      query.subcategory = req.query.subcategoryId;
    }
    if (req.query.gender) {
      query.gender = req.query.gender;
    }
    if (req.query.color) {
      query.color = req.query.color;
    }
    if (req.query.brand) {
      query.brand = req.query.brand;
    }
    if (req.query.shape) {
      query.shape = req.query.shape;
    }
    if (req.query.style) {
      query.style = req.query.style;
    }
    if (req.query.fromDate && !req.query.toDate) {
      query.createdAt = { $gte: req.query.fromDate };
    }
    if (!req.query.fromDate && req.query.toDate) {
      query.createdAt = { $lte: req.query.toDate };
    }
    if (req.query.fromDate && req.query.toDate) {
      query.$and = [
        { createdAt: { $gte: req.query.fromDate } },
        { createdAt: { $lte: req.query.toDate } },
      ];
    }
    var limit = parseInt(req.query.limit);
    var options = {
      page: parseInt(req.query.page) || 1,
      limit: limit || 1000,
      sort: { createdAt: -1 },
      populate: { path: 'category subcategory color gender brand shape style' }
    }
    product.paginate(query, options, (transErr, transRes) => {
      if (transErr) {
        return res.status(501).send({ message: "Internal Server error" + transErr.message });
      } else if (transRes.docs.length == 0) {
        return res.status(200).send({ status: 200, message: "Product data found successfully.", data: [] });
      } else {
        return res.status(200).send({ status: 200, message: "Product data found successfully.", data: transRes });
      }
    })

  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: "Internal Server error" + error.message });
  }
};
exports.createWishlist = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;
    let wishList = await Wishlist.findOne({ user: userId });
    if (!wishList) {
      wishList = new Wishlist({ user: userId, products: [productId] });
    } else {
      if (!wishList.products.includes(productId)) {
        wishList.products.push(productId);
      } else {
        return res.status(200).json({ status: 200, message: "Product is already in the wishlist" });
      }
    }
    await wishList.save();
    return res.status(200).json({ status: 200, message: "Product added to wishlist successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 500, message: "Server error", data: {} });
  }
};
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found", status: 404 });
    }
    const productId = req.params.id;
    const viewProduct = await Product.findById(productId);
    if (!viewProduct) {
      return res.status(404).json({ message: "Product not found", status: 404 });
    }
    wishlist.products.pull(productId);
    await wishlist.save();
    // viewProduct.Wishlistuser.pull(userId);
    // await viewProduct.save();
    return res.status(200).json({ status: 200, message: "Removed from Wishlist" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 500, message: "Server error", data: {} });
  }
};
exports.myWishlist = async (req, res, next) => {
  try {
    let myList = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!myList) {
      myList = await Wishlist.create({ user: req.user._id });
    }
    console.log(myList);
    let array = []
    for (let i = 0; i < myList.products.length; i++) {
      const data = await product.findById(myList.products[i]._id).populate('style shape brand gender color subcategory category')
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
exports.getProductDetails = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
    const findData = await recentlyView.findOne({ user: req.user._id, products: product._id });
    if (findData) {
      const saved = await recentlyView.findByIdAndUpdate({ _id: findData._id }, { $set: { products: product._id } }, { new: true });
      if (saved) {
        return res.status(200).json({ status: 200, message: "Product Data found successfully.", data: product })
      }
    } else {
      const saved = await recentlyView.create({ user: req.user._id, products: product._id });
      if (saved) {
        return res.status(200).json({ status: 200, message: "Product Data found successfully.", data: product })
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(501).send({ status: 501, message: "server error.", data: {}, });
  }
};
exports.getRecentlyView = async (req, res, next) => {
  try {
    const cart = await recentlyView.find({ user: req.user._id }).populate({ path: "products" }).sort({ "updateAt": -1 });
    if (!cart) {
      return res.status(200).json({ success: false, msg: "No recentlyView", cart: {} });
    }
    return res.status(200).json({ success: true, msg: "recentlyView retrieved successfully", cart: cart });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.addToCart = async (req, res, next) => {
  try {
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
      const products = await productModel.findById(req.params.id);
      if (!products) {
        return next(new ErrorHander("Product not found", 404));
      }
      const newCart = {
        user: req.user._id,
        products: [{ productId: products._id, quantity: req.body.quantity }],
      };
      const savedCart = await cartModel.create(newCart);
      return res.status(200).json({ status: 200, message: "Product added to cart successfully", data: savedCart, });
    } else {
      const products = await productModel.findById(req.params.id);
      if (!products) {
        return next(new ErrorHander("Product not found", 404));
      }
      const existingProduct = cart.products.find((item) => item.productId.toString() === products._id.toString());
      if (existingProduct) {
        existingProduct.quantity = req.body.quantity;
      } else {
        cart.products.push({ productId: products._id, quantity: req.body.quantity });
      }
      const savedCart = await cart.save();
      return res.status(200).json({ status: 200, message: "Product added to cart successfully", data: savedCart, });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getCart = async (req, res, next) => {
  try {
    const cart = await cartModel.findOne({ user: req.user._id }).populate('products.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for the specified user.' });
    }
    const updatedProducts = cart.products.map((cartProduct) => {
      const product = cartProduct.productId;
      const productType = product.type || "product";
      const priceField = productType === "product" ? "soldPrice" : "price";
      const mrp = product.price || 0;
      const netPrice = product[priceField] || 0;
      let discount = 0;
      if (mrp > 0) {
        discount = mrp - netPrice;
      } else {
        discount = 0
      }
      return {
        ...cartProduct.toObject(),
        mrp,
        netPrice,
        discount,
        total: cartProduct.quantity * netPrice,
      };
    });
    const totalPrice = updatedProducts.reduce((total, cartProduct) => {
      return total + cartProduct.total;
    }, 0);
    return res.status(200).json({
      status: 200,
      message: "Get cart successfully",
      data: {
        cart: { ...cart.toObject(), products: updatedProducts },
        totalPrice,

      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
const reffralCode = async () => {
  var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let OTP = '';
  for (let i = 0; i < 9; i++) {
    OTP += digits[Math.floor(Math.random() * 36)];
  }
  return OTP;
}