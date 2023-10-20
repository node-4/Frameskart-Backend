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
        app.get("/api/v1/admin/listStore", [authJwt.verifyToken], auth.listStore);
        app.get("/api/v1/admin/viewStore/:id", auth.viewStore);
        app.put("/api/v1/admin/Store/editStore/:id", [authJwt.verifyToken], upload.single('image'), auth.editStore);
        app.delete("/api/v1/admin/deleteStore/:id", [authJwt.verifyToken], auth.deleteStore);
}