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
        app.post('/api/v1/cart/addToCart/:cartType/:id', [authJwt.verifyToken], auth.addToCart);
        app.get('/api/v1/user/getOrder', [authJwt.verifyToken], auth.getOrder);
        app.get('/api/v1/user/getOrderbyId/:id', [authJwt.verifyToken], auth.getOrderById);
        app.put('/api/v1/user/updateWhatAppnotificationStatus', [authJwt.verifyToken], auth.updateWhatAppnotificationStatus);
        app.put('/api/v1/user/updateSmsNotificationStatus', [authJwt.verifyToken], auth.updateSmsNotificationStatus);
        app.put('/api/v1/user/updatepushNotificationStatus', [authJwt.verifyToken], auth.updatepushNotificationStatus);
        app.put('/api/v1/user/updateEmailNotificationStatus', [authJwt.verifyToken], auth.updateEmailNotificationStatus);

}