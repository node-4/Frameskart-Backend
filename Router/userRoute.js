const express = require("express");
const auth = require("../Controller/userController");
const router = express.Router();
const authJwt = require("../middleware/authJwt");



module.exports = (app) => {
        app.post("/api/v1/user/login", auth.loginUser);
        app.post("/api/v1/user/socialLogin", auth.socialLogin);
        app.post("/api/v1/user/verify/otp", auth.verifyOtplogin);
        app.get("/api/v1/user/me", authJwt.verifyToken, auth.getUserDetails);
        app.post("/api/v1/feedback/giveFeedback", authJwt.verifyToken, auth.giveFeedback);
        app.get("/api/v1/feedback/GetAllFeedBack", auth.GetAllFeedBack);
        app.get("/api/v1/feedback/GetFeedbackById/:id", auth.GetFeedbackById);
        app.post("/api/v1/user/applyforEyeTestCamp", authJwt.verifyToken, auth.applyforEyeTestCamp);
        app.post("/api/v1/user/applyforFranchiseInquiry", authJwt.verifyToken, auth.applyforFranchiseInquiry);
        app.post("/api/v1/user/createWishlist/:id", [authJwt.verifyToken], auth.createWishlist);
        app.post("/api/v1/user/removeFromWishlist/:id", [authJwt.verifyToken], auth.removeFromWishlist);
        app.get("/api/v1/user/myWishlist", [authJwt.verifyToken], auth.myWishlist);
        app.get("/api/v1/user/getProducts", auth.listProduct);
        app.get("/api/v1/user/newArrivalProduct", auth.newArrivalProduct);
        app.get('/api/v1/cart', [authJwt.verifyToken], auth.getCart);
        app.post('/api/v1/addToCart/:id', [authJwt.verifyToken], auth.addToCart);
        app.post('/api/v1/checkout', [authJwt.verifyToken], auth.checkout);
        app.get("/api/v1/successOrder/:orderId", [authJwt.verifyToken], auth.successOrder);
        app.get("/api/v1/cancelOrder/:orderId", [authJwt.verifyToken], auth.cancelOrder);
        app.get('/api/v1/user/getOrder', [authJwt.verifyToken], auth.getOrder);
        app.get('/api/v1/user/getOrderbyId/:id', [authJwt.verifyToken], auth.getOrderById);
        app.put('/api/v1/user/updateWhatAppnotificationStatus', [authJwt.verifyToken], auth.updateWhatAppnotificationStatus);
        app.put('/api/v1/user/updateSmsNotificationStatus', [authJwt.verifyToken], auth.updateSmsNotificationStatus);
        app.put('/api/v1/user/updatepushNotificationStatus', [authJwt.verifyToken], auth.updatepushNotificationStatus);
        app.put('/api/v1/user/updateEmailNotificationStatus', [authJwt.verifyToken], auth.updateEmailNotificationStatus);
        app.post('/api/v1/addPower', [authJwt.verifyToken], auth.addPower);
        app.get('/api/v1/getPower', [authJwt.verifyToken], auth.getPower);
        app.get('/api/v1/getRecentlyView', [authJwt.verifyToken], auth.getRecentlyView);
        app.get("/api/v1/getProductsbyid/:id", [authJwt.verifyToken], auth.getProductDetails);
        app.post("/api/v1/user/address/new", [authJwt.verifyToken], auth.createAddress);
        app.get("/api/v1/user/getAddress", [authJwt.verifyToken], auth.getallAddress);
        app.put("/api/v1/user/address/:id", [authJwt.verifyToken], auth.updateAddress)
        app.delete('/api/v1/user/address/:id', [authJwt.verifyToken], auth.deleteAddress);
        app.get('/api/v1/user/address/:id', [authJwt.verifyToken], auth.getAddressbyId);
        app.post('/api/v1/wallet/addWallet', [authJwt.verifyToken], auth.addMoney);
        app.post('/api/v1/wallet/removeWallet', [authJwt.verifyToken], auth.removeMoney);
        app.get('/api/v1/wallet/getwallet', [authJwt.verifyToken], auth.getWallet)
        app.get("/api/v1/allTransactionUser", [authJwt.verifyToken], auth.allTransactionUser);
        app.get("/api/v1/allcreditTransactionUser", [authJwt.verifyToken], auth.allcreditTransactionUser);
        app.get("/api/v1/allDebitTransactionUser", [authJwt.verifyToken], auth.allDebitTransactionUser);
}