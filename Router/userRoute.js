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
        
}