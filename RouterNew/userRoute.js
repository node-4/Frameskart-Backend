const express = require("express");
const auth = require("../ControllerNew/userController");
const router = express.Router();
const authJwt = require("../middlewareNew/authJwt");
module.exports = (app) => {
        app.post("/api/v1/user/login", auth.loginUser);
        app.post("/api/v1/user/socialLogin", auth.socialLogin);
        app.post("/api/v1/user/verify/otp", auth.verifyOtplogin);
        app.get("/api/v1/user/me", authJwt.verifyToken, auth.getUserDetails);
        app.put('/api/v1/user/updateWhatAppnotificationStatus', [authJwt.verifyToken], auth.updateWhatAppnotificationStatus);
        app.put('/api/v1/user/updateSmsNotificationStatus', [authJwt.verifyToken], auth.updateSmsNotificationStatus);
        app.put('/api/v1/user/updatepushNotificationStatus', [authJwt.verifyToken], auth.updatepushNotificationStatus);
        app.put('/api/v1/user/updateEmailNotificationStatus', [authJwt.verifyToken], auth.updateEmailNotificationStatus);
        app.post('/api/v1/addPower', [authJwt.verifyToken], auth.addPower);
        app.get('/api/v1/getPower', [authJwt.verifyToken], auth.getPower);
        app.post("/api/v1/feedback/giveFeedback", authJwt.verifyToken, auth.giveFeedback);
        app.get("/api/v1/feedback/GetAllFeedBack", auth.GetAllFeedBack);
        app.get("/api/v1/feedback/GetFeedbackById/:id", auth.GetFeedbackById);
        app.post("/api/v1/user/applyforEyeTestCamp", authJwt.verifyToken, auth.applyforEyeTestCamp);
        app.post("/api/v1/user/applyforFranchiseInquiry", authJwt.verifyToken, auth.applyforFranchiseInquiry);
        app.post('/api/v1/user/help/addQuery', [authJwt.verifyToken], auth.AddQuery);
        app.get('/api/v1/user/help/getAllQuery', [authJwt.verifyToken], auth.getAllQuery);
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
        app.post("/api/v1/transferAllEcashToWallet", [authJwt.verifyToken], auth.transferAllEcashToWallet);
}