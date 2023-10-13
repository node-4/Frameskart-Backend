const {
  createCategory,
  updateCategory,
  getCategories,
  removeCategory,
} = require("../Controller/categoryController");

const authJwt = require("../middleware/authJwt");
// const auth = require("../middleware/authSeller");
const router = require("express").Router();

router.route("/createCategory").post(createCategory);
router.route("/allCategory").get(getCategories);
router.route("/updateCategory/:id").put(updateCategory);
router.route("/removeCategory/:id").delete(removeCategory);

module.exports = router;
