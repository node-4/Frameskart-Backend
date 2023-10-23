const auth = require("../Controller/adminController");
const { upload, productUpload } = require('../middleware/imageupload')
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
        app.post("/api/v1/admin/accessories/createAccessories", [authJwt.verifyToken], upload.single('image'), auth.createAccessories);
        app.get("/api/v1/admin/accessories/allAccessories", auth.getAccessories);
        app.put("/api/v1/admin/accessories/updateAccessories/:id", [authJwt.verifyToken], upload.single('image'), auth.updateAccessories);
        app.delete("/api/v1/admin/accessories/removeAccessories/:id", [authJwt.verifyToken], auth.removeAccessories)
}