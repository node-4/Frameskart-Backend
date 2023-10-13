const {
    createFrame,
    updateFrame,
    getFrame,
    removeFrame,
  } = require("../Controller/frameController");
  
  const authJwt = require("../middleware/authJwt");
  // const auth = require("../middleware/authSeller");
  const router = require("express").Router();
  
  router.route("/createFrame").post(createFrame);
  router.route("/allFrame").get(getFrame);
  router.route("/updateFrame/:id").put(updateFrame);
  router.route("/removeFrame/:id").delete(removeFrame);
  
  module.exports = router;
  