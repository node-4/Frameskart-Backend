const Brand = require("../Model/brandModel");
require('dotenv').config();

const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ 
    cloud_name: 'dtijhcmaa', 
    api_key: '624644714628939', 
    api_secret: 'tU52wM1-XoaFD2NrHbPrkiVKZvY' 
  });
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});
const upload = multer({ storage: storage });

exports.createBrand = async (req, res) => {
  try {
    let findBrand = await Brand.findOne({ name: req.body.name });
    console.log(req.body.name)
    if (findBrand) {
      res.status(409).json({ message: "Brand already exit.", status: 404, data: {} });
    } else {
      upload.single("image")(req, res, async (err) => {
        if (err) { return res.status(400).json({ msg: err.message }); }
        const fileUrl = req.file ? req.file.path : "";
        const data = { name: req.body.name, image: fileUrl };
        const brand = await Brand.create(data);
        res.status(200).json({ message: "Brand add successfully.", status: 200, data: brand });
      })
    }

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};
exports.getBrand = async (req, res) => {
  const brand = await Brand.find({});
  res.status(201).json({ success: true, brand, });
};
exports.updateBrand = async (req, res) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    res.status(404).json({ message: "Brand Not Found", status: 404, data: {} });
  }
  upload.single("image")(req, res, async (err) => {
    if (err) { return res.status(400).json({ msg: err.message }); }
    const fileUrl = req.file ? req.file.path : "";
    brand.image = fileUrl || series.image;
    brand.name = req.body.name;
    let update = await brand.save();
    res.status(200).json({ message: "Updated Successfully", data: update });
  })
};
exports.removeBrand = async (req, res) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    res.status(404).json({ message: "Brand Not Found", status: 404, data: {} });
  } else {
    await Brand.findByIdAndDelete(brand._id);
    res.status(200).json({ message: "Brand Deleted Successfully !" });
  }
};