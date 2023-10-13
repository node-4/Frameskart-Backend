const {
    createSubcategory,
    updateSubcategory,
    getSubcategories,
    removeSubcategory,
    getbyCategory
  } = require("../Controller/subCategoryController");

  const authJwt = require("../middleware/authJwt");
  const router = require("express").Router();
  
 router.route("/createsubcategory").post(createSubcategory);
  router.route("/allsubcategory").get(getSubcategories);
  router.route("/updatesubcategory/:id").put(  updateSubcategory);
  router.route("/removesubcategory/:id").delete(removeSubcategory);
  router.route("/subcategory/:categoryId").get(getbyCategory);
  
  module.exports = router;