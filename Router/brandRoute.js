const {
    createBrand,
    updateBrand,
    getBrand,
    removeBrand,
  } = require("../Controller/brandController");
  
  const authJwt = require("../middleware/authJwt");
  // const auth = require("../middleware/authSeller");
  const router = require("express").Router();
  

  
  module.exports = router;
  