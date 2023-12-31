const auth = require("../Controller/adminController");
const { upload, FranchiseUpload, productUpload } = require('../middleware/imageupload')
const authJwt = require("../middleware/authJwt");
module.exports = (app) => {
        app.post("/api/v1/admin/registration", auth.registration);
        app.post("/api/v1/admin/signin", auth.signin);
        app.post("/api/v1/admin/RecommendeYoutube/addRecommendeYoutube", [authJwt.verifyToken], upload.single('image'), auth.createRecommendeYoutube);
        app.get("/api/v1/admin/RecommendeYoutube/allRecommendeYoutube", auth.getRecommendeYoutube);
        app.get("/api/v1/admin/RecommendeYoutube/getRecommendeYoutubeBytype/:type", auth.getRecommendeYoutubeBytype);
        app.put("/api/v1/admin/RecommendeYoutube/updateRecommendeYoutube/:id", [authJwt.verifyToken], upload.single('image'), auth.updateRecommendeYoutube);
        app.delete("/api/v1/admin/RecommendeYoutube/deleteRecommendeYoutube/:id", [authJwt.verifyToken], auth.removeRecommendeYoutube);
        app.post("/api/v1/admin/Store/addStore", [authJwt.verifyToken], upload.single('image'), auth.addStore);
        app.get("/api/v1/admin/listStore", auth.listStore);
        app.get("/api/v1/admin/viewStore/:id", auth.viewStore);
        app.put("/api/v1/admin/Store/editStore/:id", [authJwt.verifyToken], upload.single('image'), auth.editStore);
        app.delete("/api/v1/admin/deleteStore/:id", [authJwt.verifyToken], auth.deleteStore);
        app.post('/api/v1/banner', [authJwt.verifyToken], upload.single('image'), auth.AddBanner);
        app.get('/api/v1/banner', auth.getBanner);
        app.put('/api/v1/banner/updateBanner/:id', [authJwt.verifyToken], upload.single('image'), auth.updateBanner);
        app.delete('/api/v1/banner/:id', auth.removeBanner)
        app.post('/api/v1/offer', [authJwt.verifyToken], upload.single('image'), auth.AddOffer);
        app.get('/api/v1/offer', auth.getOffer);
        app.put('/api/v1/offer/updateOffer/:id', [authJwt.verifyToken], upload.single('image'), auth.updateOffer);
        app.delete('/api/v1/offer/:id', auth.removeOffer)
        app.post("/api/v1/category/createCategory", [authJwt.verifyToken], upload.single('image'), auth.createCategory);
        app.get("/api/v1/category/allCategory", auth.getCategories);
        app.put("/api/v1/category/updateCategory/:id", [authJwt.verifyToken], upload.single('image'), auth.updateCategory);
        app.delete("/api/v1/category/removeCategory/:id", [authJwt.verifyToken], auth.removeCategory);
        app.post("/api/v1/subcategory/createsubcategory", [authJwt.verifyToken], auth.createSubcategory);
        app.get("/api/v1/subcategory/allsubcategory", auth.getSubcategories);
        app.put("/api/v1/subcategory/updatesubcategory/:id", [authJwt.verifyToken], auth.updateSubcategory);
        app.delete("/api/v1/subcategory/removesubcategory/:id", [authJwt.verifyToken], auth.removeSubcategory);
        app.get("/api/v1/subcategory/subcategory/:categoryId", auth.getSubcategoryByCategory);
        app.post("/api/v1/brand/createBrand", upload.single('image'), [authJwt.verifyToken], auth.createBrand);
        app.get("/api/v1/brand/allBrand", auth.getBrand);
        app.put("/api/v1/brand/updateBrand/:id", upload.single('image'), [authJwt.verifyToken], auth.updateBrand);
        app.delete("/api/v1/brand/removeBrand/:id", [authJwt.verifyToken], auth.removeBrand)
        app.post("/api/v1/admin/ColorGender/addColorGender", [authJwt.verifyToken], auth.createColorGender);
        app.get("/api/v1/admin/ColorGender/allColorGender", auth.getColorGender);
        app.get("/api/v1/admin/ColorGender/getColorGenderBytype/:type", auth.getColorGenderBytype);
        app.put("/api/v1/admin/ColorGender/updateColorGender/:id", [authJwt.verifyToken], auth.updateColorGender);
        app.delete("/api/v1/admin/ColorGender/deleteColorGender/:id", [authJwt.verifyToken], auth.removeColorGender);
        app.post("/api/v1/admin/Shape/addShape", [authJwt.verifyToken], upload.single('image'), auth.AddShape);
        app.get("/api/v1/admin/Shape/allShape", auth.getShape);
        app.put("/api/v1/admin/Shape/updateShape/:id", [authJwt.verifyToken], upload.single('image'), auth.updateShape);
        app.delete("/api/v1/admin/Shape/deleteShape/:id", [authJwt.verifyToken], auth.removeShape);
        app.post("/api/v1/admin/Style/AddStyle", [authJwt.verifyToken], upload.single('image'), auth.AddStyle);
        app.get("/api/v1/admin/Style/allStyle", auth.getStyle);
        app.put("/api/v1/admin/Style/updateStyle/:id", [authJwt.verifyToken], upload.single('image'), auth.updateStyle);
        app.delete("/api/v1/admin/Style/deleteStyle/:id", [authJwt.verifyToken], auth.removeStyle);
        app.post("/api/v1/admin/accessories/createAccessories", [authJwt.verifyToken], upload.single('image'), auth.createAccessories);
        app.get("/api/v1/admin/accessories/allAccessories", auth.getAccessories);
        app.put("/api/v1/admin/accessories/updateAccessories/:id", [authJwt.verifyToken], upload.single('image'), auth.updateAccessories);
        app.delete("/api/v1/admin/accessories/removeAccessories/:id", [authJwt.verifyToken], auth.removeAccessories)
        app.post("/api/v1/ContactDetails/add", [authJwt.verifyToken], upload.single('image'), auth.addContactDetails);
        app.get("/api/v1/admin/ContactDetails/view", auth.viewContactDetails);
        app.post("/api/v1/admin/createAboutUs", upload.single('image'), [authJwt.verifyToken], auth.createAboutUs);
        app.get("/api/v1/admin/getAllAboutUs", auth.getAllAboutUs);
        app.get("/api/v1/admin/getAboutUsById/:id", auth.getAboutUsById);
        app.delete("/api/v1/admin/deleteAboutUs/:id", [authJwt.verifyToken], auth.deleteAboutUs);
        app.put("/api/v1/admin/addUserinAboutUs", upload.single('image'), [authJwt.verifyToken], auth.addUserinAboutUs);
        app.delete("/api/v1/admin/deleteUserinAboutUs/:id", [authJwt.verifyToken], auth.deleteUserinAboutUs);
        app.post("/api/v1/static/faq/createFaq", authJwt.verifyToken, auth.createFaq);
        app.put("/api/v1/static/faq/:id", authJwt.verifyToken, auth.updateFaq);
        app.delete("/api/v1/static/faq/:id", authJwt.verifyToken, auth.deleteFaq);
        app.get("/api/v1/static/faq/All", auth.getAllFaqs);
        app.get("/api/v1/static/faq/:id", auth.getFaqById);
        app.post("/api/v1/admin/createPremiumLenses", upload.single('image'), [authJwt.verifyToken], auth.createPremiumLenses);
        app.get("/api/v1/admin/getAllPremiumLenses", auth.getAllPremiumLenses);
        app.get("/api/v1/admin/getPremiumLensesById/:id", auth.getPremiumLensesById);
        app.delete("/api/v1/admin/deletePremiumLenses/:id", [authJwt.verifyToken], auth.deletePremiumLenses);
        app.post("/api/v1/admin/createEyeTestCamp", upload.array('image'), [authJwt.verifyToken], auth.createEyeTestCamp);
        app.get("/api/v1/admin/getAllEyeTestCamp", auth.getAllEyeTestCamp);
        app.get("/api/v1/admin/getEyeTestCampById/:id", auth.getEyeTestCampById);
        app.delete("/api/v1/admin/deleteEyeTestCamp/:id", [authJwt.verifyToken], auth.deleteEyeTestCamp);
        app.get("/api/v1/admin/getAllEyeTestCampFormData", auth.getAllEyeTestCampFormData);
        app.post("/api/v1/admin/FranchiseTestimonial/addFranchiseTestimonial", [authJwt.verifyToken], upload.single('image'), auth.createFranchiseTestimonial);
        app.get("/api/v1/admin/FranchiseTestimonial/allFranchiseTestimonial", auth.getFranchiseTestimonial);
        app.put("/api/v1/admin/FranchiseTestimonial/updateFranchiseTestimonial/:id", [authJwt.verifyToken], upload.single('image'), auth.updateFranchiseTestimonial);
        app.delete("/api/v1/admin/FranchiseTestimonial/deleteFranchiseTestimonial/:id", [authJwt.verifyToken], auth.removeFranchiseTestimonial);
        app.get("/api/v1/admin/getAllFranchiseInquiryData", auth.getAllFranchiseInquiryData);
        app.post("/api/v1/admin/addFranchise", FranchiseUpload, [authJwt.verifyToken], auth.addFranchise);
        app.get("/api/v1/admin/getFranchise", auth.getFranchise);
        app.get("/api/v1/admin/getFranchiseById/:id", auth.getFranchiseById);
        app.delete("/api/v1/admin/DeleteFranchise/:id", [authJwt.verifyToken], auth.DeleteFranchise);
        app.post("/api/v1/admin/createProduct", productUpload, [authJwt.verifyToken], auth.createProduct);
        app.get("/api/v1/admin/getProducts", auth.getProducts);
        app.get("/api/v1/admin/getProductsbyid/:id", auth.getProductDetails);
        app.delete("/api/v1/admin/deleteProducts/:id", [authJwt.verifyToken], auth.deleteProducts);
        app.post("/api/v1/admin/notification/sendNotification", authJwt.verifyToken, auth.sendNotification);
        app.get("/api/v1/admin/notification/allNotification", authJwt.verifyToken, auth.allNotification);
        app.get('/api/v1/admin/getOrder', [authJwt.verifyToken], auth.getOrder);
        app.put('/api/v1/admin/updateOrderStatus/:id', [authJwt.verifyToken], auth.updateOrderStatus);
        app.post('/api/v1/static/createPrivacy', [authJwt.verifyToken], auth.createPrivacy);
        app.put('/api/v1/static/privacy/:id', [authJwt.verifyToken], auth.updatePrivacy);
        app.delete('/api/v1/static/privacy/:id', [authJwt.verifyToken], auth.deletePrivacy);
        app.get('/api/v1/static/getPrivacy', auth.getPrivacy);
        app.get('/api/v1/static/privacy/:id', auth.getPrivacybyId);
        app.post('/api/v1/static/createRefundPrivacy', [authJwt.verifyToken], auth.createRefundPrivacy);
        app.get('/api/v1/static/getRefundPrivacy', auth.getRefundPrivacy);
        app.post('/api/v1/static/createTerms', [authJwt.verifyToken], auth.createTerms);
        app.put('/api/v1/static/term/:id', [authJwt.verifyToken], auth.updateTerms);
        app.delete('/api/v1/static/term/:id', [authJwt.verifyToken], auth.deleteTerms);
        app.get('/api/v1/static/getTerm', auth.getTerms);
        app.get('/api/v1/static/term/:id', auth.getTermsbyId);
}