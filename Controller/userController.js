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
const accessories = require('../Model/accessoriesModel');
const Wishlist = require("../Model/whishList");
const cartModel = require("../Model/cartModel");
const userOrders = require("../Model/userOrders");
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
exports.listProduct = async (req, res) => {
  try {
    let query = {};
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
exports.getCart = async (req, res, next) => {
  try {
    const cart = await cartModel.findOne({ user: req.user._id })
      .populate('products.productId', 'name soldPrice image')
      .populate('accessories.accessoriesId', 'name price image');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for the specified user.' });
    }
    const productTotal = cart.products.reduce((total, product) => {
      return total + (product.productId.soldPrice * product.quantity);
    }, 0);
    const accessoryTotal = cart.accessories.reduce((total, accessory) => {
      return total + (accessory.accessoriesId.price * accessory.quantity);
    }, 0);
    const totalCost = productTotal + accessoryTotal;
    return res.status(200).json({ success: true, msg: "Cart retrieved successfully", cart, totalCost });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.addToCart = async (req, res, next) => {
  try {
    const product2 = req.params.id;
    const cartType = req.params.cartType;
    let cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
      cart = await createCart(req.user._id);
    }
    const cartKey = cartType === 'accessories' ? 'accessories' : 'products';
    const productKey = cartType === 'accessories' ? 'accessoriesId' : 'productId';
    const product1 = await product.findById(product2);
    const product3 = await accessories.findById(product2);
    if (!product1 && !product3) {
      return next(new ErrorHander("Product not found", 404));
    }
    const productIndex = cart[cartKey].findIndex((cartProduct) => {
      return cartProduct[productKey].toString() === product2;
    });

    if (productIndex < 0) {
      let obj = {
        [productKey]: product2,
        quantity: req.body.quantity
      };
      cart[cartKey].push(obj);
      await cart.save();
      return res.status(200).json({ msg: "Product added to cart", data: cart });
    } else {
      return res.status(200).json({ msg: "Product already in cart", data: cart });
    }
  } catch (error) {
    next(error);
  }
};
const createCart = async (userId) => {
  try {
    const cart = await cartModel.create({ user: userId });
    return cart;
  } catch (error) {
    throw error;
  }
};
exports.newArrivalProduct = async (req, res) => {
  try {
    let query = {};
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
exports.getOrder = async (req, res, next) => {
  try {
    if (req.query.orderStatus != (null || undefined)) {
      const cart = await userOrders.find({ userId: req.user._id, orderStatus: req.query.orderStatus }).populate('products.productId').populate('accessories.accessoriesId');
      if (cart.length == 0) {
        return res.status(404).json({ message: 'Orders not found for the specified user.' });
      }
      return res.status(200).json({ success: true, msg: "Orders retrieved successfully", data: cart });
    } else {
      const cart = await userOrders.find({ userId: req.user._id }).populate('products.productId').populate('accessories.accessoriesId');
      if (cart.length == 0) {
        return res.status(404).json({ message: 'Orders not found for the specified user.' });
      }
      return res.status(200).json({ success: true, msg: "Orders retrieved successfully", data: cart });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getOrderById = async (req, res) => {
  try {
    const Ads = await userOrders.findById({ _id: req.params.id });
    if (!Ads) {
      return res.status(404).json({ status: 404, message: "No data found", data: {} });
    }
    return res.status(200).json({ status: 200, message: "Data found successfully.", data: Ads })
  } catch (err) {
    console.log(err);
    return res.status(501).send({ status: 501, message: "server error.", data: {}, });
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