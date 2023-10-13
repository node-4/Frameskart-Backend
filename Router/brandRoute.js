const {
    createBrand,
    updateBrand,
    getBrand,
    removeBrand,
  } = require("../Controller/brandController");
  
  const authJwt = require("../middleware/authJwt");
  // const auth = require("../middleware/authSeller");
  const router = require("express").Router();
  
  router.route("/createBrand").post(createBrand);
  router.route("/allBrand").get(getBrand);
  router.route("/updateBrand/:id").put(updateBrand);
  router.route("/removeBrand/:id").delete(removeBrand);
  
  module.exports = router;
  