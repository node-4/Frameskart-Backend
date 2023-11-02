const {
    createSeries,
    updateSeries,
    getSeries,
    removeSeries,
  } = require("../Controller/seriesController");
  
  const authJwt = require("../../middleware/authJwt");
  // const auth = require("../middleware/authSeller");
  const router = require("express").Router();
  
  router.route("/createSeries").post(createSeries);
  router.route("/allSeries").get(getSeries);
  router.route("/updateSeries/:id").put(updateSeries);
  router.route("/removeSeries/:id").delete(removeSeries);
  
  module.exports = router;
  