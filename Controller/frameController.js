const Frame = require("../Model/frameModel");
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

exports.createFrame = async (req, res) => {
  try {
    let findFrame = await Frame.findOne({ name: req.body.name });
    console.log(req.body.name)
    if (findFrame) {
      res.status(409).json({ message: "Frame already exit.", status: 404, data: {} });
    } else {
      upload.single("image")(req, res, async (err) => {
        if (err) { return res.status(400).json({ msg: err.message }); }
        const fileUrl = req.file ? req.file.path : "";
        const data = { name: req.body.name, image: fileUrl };
        const frame = await Frame.create(data);
        res.status(200).json({ message: "Frame add successfully.", status: 200, data: frame });
      })
    }

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};
exports.getFrame = async (req, res) => {
  const Frames = await Frame.find({});
  res.status(201).json({ success: true, Frames, });
};
exports.updateFrame = async (req, res) => {
  const { id } = req.params;
  const Frames = await Frame.findById(id);
  if (!Frames) {
    res.status(404).json({ message: "Frame Not Found", status: 404, data: {} });
  }
  upload.single("image")(req, res, async (err) => {
    if (err) { return res.status(400).json({ msg: err.message }); }
    const fileUrl = req.file ? req.file.path : "";
    Frames.image = fileUrl || Frames.image;
    Frames.name = req.body.name;
    let update = await Frames.save();
    res.status(200).json({ message: "Updated Successfully", data: update });
  })
};
exports.removeFrame = async (req, res) => {
  const { id } = req.params;
  const Frames = await Frame.findById(id);
  if (!Frames) {
    res.status(404).json({ message: "Frame Not Found", status: 404, data: {} });
  } else {
    await Frame.findByIdAndDelete(Frames._id);
    res.status(200).json({ message: "Frame Deleted Successfully !" });
  }
};