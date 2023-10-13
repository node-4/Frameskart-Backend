const Product = require("../Model/productModel");
const mongoose = require("mongoose");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dtijhcmaa",
  api_key: "624644714628939",
  api_secret: "tU52wM1-XoaFD2NrHbPrkiVKZvY",
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});
const upload = multer({ storage: storage });

// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    upload.array("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ msg: err.message });
      }
      let images = [];
      for (let i = 0; i < req.files.length; i++) {
        images.push(req.files[i] ? req.files[i].path : "");
      }
      const data = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        type: req.body.type,
        quantity: req.body.quantity,
        images: images,
        category: req.body.category,
        subcategory: req.body.subcategory,
        stock: req.body.stock,
      };
      const product = await Product.create(data);
      return res
        .status(200)
        .json({
          message: "product add successfully.",
          status: 200,
          data: product,
        });
    });
  } catch (error) {
    console.log(req.body);
    res
      .status(500)
      .json({
        status: 500,
        message: "internal server error ",
        data: error.message,
      });
  }
});

exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  return res.status(200).json({
    success: true,
    products,
  });
});


exports.getProductsbyType = catchAsyncErrors(async (req, res, next) => {
  const supportType = req.params.type;

    try {
      const supportData = await Product.find({ type: supportType });
      res.json(supportData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching support data.' });
    }
  });
exports.updateProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    console.log(product);
    upload.array("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ msg: err.message });
      }

      try {
        const images = [];
        for (let i = 0; i < req.files.length; i++) {
          images.push(req.files[i] ? req.files[i].path : "");
        }


        // Update the product's information, including images
        product.name = req.body.name;
        product.description = req.body.description;
        product.price = req.body.price;
        product.category = req.body.category;
        product.images = images;
        product.subCategory = req.body.subCategory;

        // Save the updated product
        await product.save();

        return res.status(200).json({
          message: "Product updated successfully.",
          status: 200,
          data: product,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: 500,
          message: "Internal server error",
          data: error.message,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: error.message,
    });
  }
});

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

exports.getProductsbyCategory = catchAsyncErrors(async (req, res, next) => {
try {
  const categoryId = req.params.categoryId;

  const products = await Product.find({ category: categoryId });

  if (!products || products.length === 0) {
    return res.status(404).json({ message: 'No products found for the given category ID' });
  }

  res.status(200).json(products);
} catch (error) {
  console.error('Error fetching products:', error);
  res.status(500).json({ error: 'An error occurred while fetching products' });
}
});


exports.getProductsbysubCategory = catchAsyncErrors(async (req, res, next) => {
try {
  const subcategory = req.params.subcategory;

  const products = await Product.find({ subcategory });

  if (!products || products.length === 0) {
    return res.status(404).json({ message: 'No products found for the given subcategory' });
  }

  res.status(200).json(products);
} catch (error) {
  console.error('Error fetching products:', error);
  res.status(500).json({ error: 'An error occurred while fetching products' });
}
});

exports.bysubCategoryandCategory = catchAsyncErrors(async (req, res, next) => {
try {
  const category = req.params.category;
  const subcategory = req.params.subcategory;

  const products = await Product.find({ category, subcategory });

  if (!products || products.length === 0) {
    return res.status(404).json({ message: 'No products found for the given category and subcategory' });
  }

  res.status(200).json(products);
} catch (error) {
  console.error('Error fetching products:', error);
  res.status(500).json({ error: 'An error occurred while fetching products' });
}
});

exports.deleteProducts = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  await Product.findByIdAndDelete({ _id: product._id });

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

exports.newArrival = catchAsyncErrors(async (req, res, next) => {

try {
  const productsByCreationDate = await Product.find().sort({ createdAt: -1 });
  res.status(200).json(productsByCreationDate);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'An error occurred while fetching products by creation date' });
}
});