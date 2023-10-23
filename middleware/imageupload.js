var multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: 'dtijhcmaa', api_key: '624644714628939', api_secret: 'tU52wM1-XoaFD2NrHbPrkiVKZvY', });
const storage = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "shahina/images/product", allowed_formats: ["jpg", "avif", "webp", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], }, });
const upload = multer({ storage: storage });
const productUpload = upload.fields([{ name: 'images', maxCount: 20 }, { name: 'image', maxCount: 1 }]);
module.exports = { upload, productUpload, };