const Series = require("../Model/seriesModel");
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

exports.createSeries = async (req, res) => {
  try {
    let findSeries = await Series.findOne({ name: req.body.name });
    console.log(req.body.name)
    if (findSeries) {
      res.status(409).json({ message: "Series already exit.", status: 404, data: {} });
    } else {
      upload.single("image")(req, res, async (err) => {
        if (err) { return res.status(400).json({ msg: err.message }); }
        const fileUrl = req.file ? req.file.path : "";
        const data = { name: req.body.name, image: fileUrl };
        const series = await Series.create(data);
        res.status(200).json({ message: "Series add successfully.", status: 200, data: series });
      })
    }

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};
exports.getSeries = async (req, res) => {
  const series = await Series.find({});
  res.status(201).json({ success: true, series, });
};
exports.updateSeries = async (req, res) => {
  const { id } = req.params;
  const series = await Series.findById(id);
  if (!series) {
    res.status(404).json({ message: "Series Not Found", status: 404, data: {} });
  }
  upload.single("image")(req, res, async (err) => {
    if (err) { return res.status(400).json({ msg: err.message }); }
    const fileUrl = req.file ? req.file.path : "";
    series.image = fileUrl || series.image;
    series.name = req.body.name;
    let update = await series.save();
    res.status(200).json({ message: "Updated Successfully", data: update });
  })
};
exports.removeSeries = async (req, res) => {
  const { id } = req.params;
  const series = await Series.findById(id);
  if (!series) {
    res.status(404).json({ message: "series Not Found", status: 404, data: {} });
  } else {
    await Series.findByIdAndDelete(series._id);
    res.status(200).json({ message: "series Deleted Successfully !" });
  }
};