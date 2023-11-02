// const express = require("express");
// const {createProduct,getProducts,getProductDetails ,getProductsbyType,newArrival,getProductsbyCategory,deleteProducts,getProductsbysubCategory,bysubCategoryandCategory,updateProducts} = require("../Controller/productController");
// const authJwt = require("../middleware/authJwt");
// const { isAuthenticatedUser, authorizeRoles } = require("../middleware/authJwt");
// const router = express.Router();


// router.route("/new").post(createProduct);
// router.route("/get").get(getProducts);
// router.route("/get/:type").get(getProductsbyType);


// router.route("/update/:id").put(updateProducts);
// router.route("/delete/:id").delete(deleteProducts);

// router.route("/get/:id").get(getProductDetails);
// router.route("/category/:categoryId").get(getProductsbyCategory);
// router.route("/subcategory/:subcategory").get(getProductsbysubCategory);
// router.route("/:category/:subcategory").get(bysubCategoryandCategory);


// router.route("/new").get(newArrival);

// module.exports = router;
