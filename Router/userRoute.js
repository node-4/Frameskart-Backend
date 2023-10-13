const express = require("express");
const {
  loginUser,verifyOtplogin,getUserDetails
} = require("../Controller/userController");
const router = express.Router();
const authJwt = require("../middleware/authJwt");

router.route("/login").post(loginUser);
router.route("/verify/otp").post(verifyOtplogin);
router.route("/me").get(authJwt.verifyToken, getUserDetails);

module.exports = router;
