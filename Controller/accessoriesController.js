const Access = require('../Model/accessoriesModel')
require('dotenv').config();
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
exports.AddAccess = async (req, res) => {
  try {
    let findAccess = await Access.findOne({ name: req.body.name });
    console.log(req.body.name)
    if (findAccess) {
      res.status(409).json({ message: "Access already exit.", status: 404, data: {} });
    } else {
      upload.single("image")(req, res, async (err) => {
        if (err) { return res.status(400).json({ msg: err.message }); }
        // console.log(req.file);
        const fileUrl = req.file ? req.file.path : "";
        const data = { name: req.body.name, image: fileUrl };
        const access = await Access.create(data);
        res.status(200).json({ message: "Access add successfully.", status: 200, data: access });
      })
    }

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.getAccess = async (req, res) => {
  try {
    const access = await Access.find();
    res.status(200).json({ success: true, access: access });

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.updateAccess = async (req, res) => {
  const { id } = req.params;
  const access = await Access.findById(id);
  if (!access) {
    res.status(404).json({ message: "Access Not Found", status: 404, data: {} });
  }
  upload.single("image")(req, res, async (err) => {
    if (err) { return res.status(400).json({ msg: err.message }); }
    const fileUrl = req.file ? req.file.path : "";
    access.image = fileUrl || access.image;
    access.name = req.body.name;
    let update = await access.save();
    res.status(200).json({ message: "Updated Successfully", data: update });
  })
};

exports.removeAccess = async (req, res) => {
  const { id } = req.params;
  const access = await Access.findById(id);
  if (!access) {
    res.status(404).json({ message: "Access Not Found", status: 404, data: {} });
  } else {
    await Access.findByIdAndDelete(access._id);
    res.status(200).json({ message: "Access Deleted Successfully !" });
  }
};