const User = require("../Model/userModel");
const storeModel = require("../Model/store");
const Banner = require('../Model/bannerModel')
const Brand = require("../Model/brandModel");
const Category = require("../Model/categoryModel");
const Subcategory = require("../Model/subCategoryModel");
const offer = require('../Model/offerModel')
const accessories = require('../Model/accessoriesModel')
const recommendeYoutube = require("../Model/recommende&youtubeCornerByBanner");
const ContactDetail = require("../Model/contactDetails");
const static = require("../Model/static");
const colorGender = require("../Model/colorGender");
const premiumLenses = require("../Model/premiumLenses");
const eyeTestCamp = require("../Model/eyeTestCamp");
const franchiseInquiry = require("../Model/FranchiseRegistration/franchiseInquiry");
const franchise = require("../Model/FranchiseRegistration/franchise");
const franchiseTestimonial = require("../Model/FranchiseRegistration/franchiseTestimonial");
const productModel = require("../Model/productModel");
const shape = require("../Model/shape");
const bcrypt = require("bcryptjs");
const Faq = require('../Model/faq')
const jwt = require("jsonwebtoken");
const notification = require("../Model/notification");
const userOrders = require("../Model/userOrders");
exports.registration = async (req, res) => {
        const { mobileNumber, email } = req.body;
        try {
                req.body.email = email.split(" ").join("").toLowerCase();
                let user = await User.findOne({ $and: [{ $or: [{ email: req.body.email }, { mobileNumber: mobileNumber }] }], userType: "Admin" });
                if (!user) {
                        req.body.password = bcrypt.hashSync(req.body.password, 8);
                        req.body.userType = "Admin";
                        req.body.accountVerification = true;
                        const userCreate = await User.create(req.body);
                        return res.status(200).send({ message: "registered successfully ", data: userCreate, });
                } else {
                        return res.status(409).send({ message: "Already Exist", data: [] });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Server error" });
        }
};
exports.signin = async (req, res) => {
        try {
                const { email, password } = req.body;
                const user = await User.findOne({ email: email, userType: "Admin" });
                if (!user) {
                        return res
                                .status(404)
                                .send({ message: "user not found ! not registered" });
                }
                const isValidPassword = bcrypt.compareSync(password, user.password);
                if (!isValidPassword) {
                        return res.status(401).send({ message: "Wrong password" });
                }
                const accessToken = await jwt.sign({ id: user._id }, 'node5flyweis', { expiresIn: '365d', });
                let obj = {
                        fullName: user.fullName,
                        firstName: user.fullName,
                        lastName: user.lastName,
                        mobileNumber: user.mobileNumber,
                        email: user.email,
                        userType: user.userType,
                }
                return res.status(201).send({ data: obj, accessToken: accessToken });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Server error" + error.message });
        }
};
exports.createRecommendeYoutube = async (req, res) => {
        try {
                let findBrand = await recommendeYoutube.findOne({ label: req.body.label, type: req.body.type });
                if (findBrand) {
                        return res.status(409).json({ message: `${req.body.type} already exit.`, status: 409, data: {} });
                } else {
                        let fileUrl;
                        if (req.file) {
                                fileUrl = req.file ? req.file.path : "";
                        } else {
                                return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                        }
                        const data = {
                                link: req.body.link,
                                label: req.body.label,
                                image: fileUrl,
                                type: req.body.type,
                        };
                        const category = await recommendeYoutube.create(data);
                        return res.status(200).json({ message: `${req.body.type} add successfully.`, status: 200, data: category });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getRecommendeYoutube = async (req, res) => {
        const categories = await recommendeYoutube.find({});
        if (categories.length > 0) {
                return res.status(201).json({ message: "Data Found", status: 200, data: categories, });
        }
        return res.status(201).json({ message: "Data not Found", status: 404, data: {}, });

};
exports.getRecommendeYoutubeBytype = async (req, res) => {
        const categories = await recommendeYoutube.find({ type: req.params.type });
        if (categories.length > 0) {
                return res.status(201).json({ message: "Data Found", status: 200, data: categories, });
        }
        return res.status(201).json({ message: "Data not Found", status: 404, data: {}, });

};
exports.updateRecommendeYoutube = async (req, res) => {
        const { id } = req.params;
        const category = await recommendeYoutube.findById(id);
        if (!category) {
                return res.status(404).json({ message: "Data Not Found", status: 404, data: {} });
        }
        let fileUrl;
        if (req.file) {
                fileUrl = req.file ? req.file.path : "";
        } else {
                fileUrl = category.image;
        }
        category.link = req.body.link || category.link;
        category.label = req.body.label || category.label;
        category.image = fileUrl;
        category.type = category.type;;
        let update = await category.save();
        return res.status(200).json({ message: "Updated Successfully", data: update });
};
exports.removeRecommendeYoutube = async (req, res) => {
        const { id } = req.params;
        const category = await recommendeYoutube.findById(id);
        if (!category) {
                return res.status(404).json({ message: "Data Not Found", status: 404, data: {} });
        } else {
                await recommendeYoutube.findByIdAndDelete(category._id);
                return res.status(200).json({ message: "Data Deleted Successfully !" });
        }
};
exports.addStore = async (req, res) => {
        try {
                let findStore = await storeModel.findOne({ storeName: req.body.storeName });
                if (findStore) {
                        return res.status(409).send({ status: 409, message: "Already exit." });
                } else {
                        if (req.file) {
                                req.body.storeImage = req.file.path
                        } else {
                                return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                        }
                        let saveStore = await storeModel(req.body).save();
                        if (saveStore) {
                                return res.json({ status: 200, message: 'Store add successfully.', data: saveStore });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error" + error.message });
        }
};
exports.viewStore = async (req, res) => {
        try {
                let findStore = await storeModel.findOne({ _id: req.params.id })
                if (!findStore) {
                        return res.status(404).send({ status: 404, message: "Data not found" });
                } else {
                        return res.json({ status: 200, message: 'Store found successfully.', data: findStore });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error" + error.message });
        }
};
exports.editStore = async (req, res) => {
        try {
                let findStore = await storeModel.findOne({ _id: req.params.id });
                if (!findStore) {
                        return res.status(404).send({ status: 404, message: "Data not found" });
                } else {
                        if (req.file) {
                                req.body.storeImage = req.file.filename
                        }
                        let saveStore = await storeModel.findByIdAndUpdate({ _id: findStore._id }, { $set: req.body }, { new: true })
                        if (saveStore) {
                                return res.json({ status: 200, message: 'Store update successfully.', data: saveStore });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error" + error.message });
        }
};
exports.deleteStore = async (req, res) => {
        try {
                let vendorData = await User.findOne({ _id: req.user._id });
                if (!vendorData) {
                        return res.status(404).send({ status: 404, message: "User not found" });
                } else {
                        let findStore = await storeModel.findOne({ _id: req.params.id });
                        if (!findStore) {
                                return res.status(404).send({ status: 404, message: "Data not found" });
                        } else {
                                let update = await storeModel.findByIdAndDelete({ _id: findStore._id });
                                if (update) {
                                        return res.json({ status: 200, message: 'Store Delete successfully.', data: findStore });
                                }
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error" + error.message });
        }
};
exports.listStore = async (req, res) => {
        try {
                let findStore = await storeModel.find({});
                if (findStore.length == 0) {
                        return res.status(404).send({ status: 404, message: "Data not found" });
                } else {
                        return res.json({ status: 200, message: 'Store Data found successfully.', data: findStore });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error" + error.message });
        }
};
exports.AddBanner = async (req, res) => {
        try {
                let findBanner = await Banner.findOne({ name: req.body.name });
                if (findBanner) {
                        return res.status(409).json({ message: "Banner already exit.", status: 404, data: {} });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path
                        } else {
                                return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                        }
                        const data = { name: req.body.name, image: req.body.image, link: req.body.link };
                        const banner = await Banner.create(data);
                        return res.status(200).json({ message: "Banner add successfully.", status: 200, data: banner });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getBanner = async (req, res) => {
        try {
                const banners = await Banner.find();
                if (banners.length > 0) {
                        return res.status(200).json({ success: true, banners: banners });
                } else {
                        return res.status(404).json({ message: "Banner not found.", status: 200, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updateBanner = async (req, res) => {
        try {
                const { id } = req.params;
                const banner = await Banner.findById(id);
                if (!banner) {
                        return res.status(404).json({ message: "Banner Not Found", status: 404, data: {} });
                }
                if (req.file) {
                        banner.image = req.file.path
                } else {
                        banner.image = banner.image;
                }
                banner.name = req.body.name;
                banner.link = req.body.link || banner.link;
                let update = await banner.save();
                return res.status(200).json({ message: "Updated Successfully", status: 200, data: update });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.removeBanner = async (req, res) => {
        try {
                const { id } = req.params;
                const banner = await Banner.findById(id);
                if (!banner) {
                        return res.status(404).json({ message: "Banner Not Found", status: 404, data: {} });
                } else {
                        await Banner.findByIdAndDelete(banner._id);
                        return res.status(200).json({ message: "Banner Deleted Successfully !" });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.AddOffer = async (req, res) => {
        try {
                let findOffer = await offer.findOne({ name: req.body.name });
                if (findOffer) {
                        return res.status(409).json({ message: "Offer already exit.", status: 404, data: {} });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path
                        } else {
                                return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                        }
                        const data = { name: req.body.name, image: req.body.image, link: req.body.link };
                        const updateOffer = await offer.create(data);
                        return res.status(200).json({ message: "Offer add successfully.", status: 200, data: updateOffer });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getOffer = async (req, res) => {
        try {
                const updateOffer = await offer.find();
                if (updateOffer.length > 0) {
                        return res.status(200).json({ success: true, Offer: updateOffer });
                } else {
                        return res.status(404).json({ message: "Offer not found.", status: 200, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updateOffer = async (req, res) => {
        try {
                const { id } = req.params;
                const updateOffer = await offer.findById(id);
                if (!updateOffer) {
                        return res.status(404).json({ message: "Offer Not Found", status: 404, data: {} });
                }
                if (req.file) {
                        updateOffer.image = req.file.path
                } else {
                        updateOffer.image = offer.image;
                }
                updateOffer.name = req.body.name;
                updateOffer.link = req.body.link || offer.link;
                let update = await updateOffer.save();
                return res.status(200).json({ message: "Updated Successfully", status: 200, data: update });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.removeOffer = async (req, res) => {
        try {
                const { id } = req.params;
                const updateOffer = await offer.findById(id);
                if (!updateOffer) {
                        return res.status(404).json({ message: "Offer Not Found", status: 404, data: {} });
                } else {
                        await offer.findByIdAndDelete(updateOffer._id);
                        return res.status(200).json({ message: "Offer Deleted Successfully !" });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.createCategory = async (req, res) => {
        try {
                let findCategory = await Category.findOne({ name: req.body.name });
                if (findCategory) {
                        return res.status(409).json({ message: "category already exit.", status: 404, data: {} });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path
                        } else {
                                return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                        }
                        const data = { name: req.body.name, image: req.body.image };
                        const category = await Category.create(data);
                        return res.status(200).json({ message: "category add successfully.", status: 200, data: category });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getCategories = async (req, res) => {
        try {
                const updateOffer = await Category.find();
                if (updateOffer.length > 0) {
                        return res.status(200).json({ success: true, Category: updateOffer });
                } else {
                        return res.status(404).json({ message: "Category not found.", status: 200, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updateCategory = async (req, res) => {
        try {
                const { id } = req.params;
                const updateOffer = await Category.findById(id);
                if (!updateOffer) {
                        return res.status(404).json({ message: "Category Not Found", status: 404, data: {} });
                }
                if (req.file) {
                        updateOffer.image = req.file.path
                } else {
                        updateOffer.image = offer.image;
                }
                updateOffer.name = req.body.name;
                let update = await updateOffer.save();
                return res.status(200).json({ message: "Updated Successfully", status: 200, data: update });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.removeCategory = async (req, res) => {
        try {
                const { id } = req.params;
                const updateOffer = await Category.findById(id);
                if (!updateOffer) {
                        return res.status(404).json({ message: "Category Not Found", status: 404, data: {} });
                } else {
                        await Category.findByIdAndDelete(updateOffer._id);
                        return res.status(200).json({ message: "Category Deleted Successfully !" });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.createSubcategory = async (req, res) => {
        try {
                let findSubcategory = await Subcategory.findOne({ name: req.body.name });
                if (findSubcategory) {
                        return res.status(409).json({ message: "Subcategory already exit.", status: 404, data: {} });
                } else {
                        const data = { name: req.body.name, categoryId: req.body.categoryId };
                        const subcategory = await Subcategory.create(data);
                        return res.status(200).json({ message: "Subcategory add successfully.", status: 200, data: subcategory });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getSubcategories = async (req, res) => {
        try {
                const updateOffer = await Subcategory.find();
                if (updateOffer.length > 0) {
                        return res.status(200).json({ success: true, message: "Subcategory found.", Subcategory: updateOffer });
                } else {
                        return res.status(404).json({ message: "Subcategory not found.", status: 200, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updateSubcategory = async (req, res) => {
        try {
                const { id } = req.params;
                const updateOffer = await Subcategory.findById(id);
                if (!updateOffer) {
                        return res.status(404).json({ message: "Subcategory Not Found", status: 404, data: {} });
                }
                if (req.body.categoryId != (null || undefined)) {
                        const updateOffer1 = await Category.findById({ _id: req.body.categoryId });
                        if (!updateOffer1) {
                                return res.status(404).json({ message: "Category Not Found", status: 404, data: {} });
                        }
                        updateOffer.categoryId = updateOffer1._id;
                } else {
                        updateOffer.categoryId = updateOffer.categoryId;
                }
                updateOffer.name = req.body.name || updateOffer.name;
                updateOffer.categoryId = req.body.categoryId || updateOffer.categoryId;
                let update = await updateOffer.save();
                return res.status(200).json({ message: "Updated Successfully", status: 200, data: update });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.removeSubcategory = async (req, res) => {
        try {
                const { id } = req.params;
                const updateOffer = await Subcategory.findById(id);
                if (!updateOffer) {
                        return res.status(404).json({ message: "Subcategory Not Found", status: 404, data: {} });
                } else {
                        await Subcategory.findByIdAndDelete(updateOffer._id);
                        return res.status(200).json({ message: "Subcategory Deleted Successfully !" });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getSubcategoryByCategory = async (req, res) => {
        try {
                const categoryId = req.params.categoryId;
                const subcategories = await Subcategory.find({ categoryId: categoryId });
                if (subcategories.length == 0) {
                        return res.status(404).json({ message: "Subcategory Not Found", status: 404, data: {} });
                } else {
                        return res.status(200).json({ message: "Subcategory Data  Successfully !", status: 200, data: subcategories });
                }
        } catch (error) {
                return res.status(500).json({ success: false, error: 'Internal server error' });
        }
};
exports.createBrand = async (req, res) => {
        try {
                let findBrand = await Brand.findOne({ name: req.body.name });
                if (findBrand) {
                        return res.status(409).json({ message: "Brand already exit.", status: 404, data: {} });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path
                        } else {
                                return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                        }
                        const data = { name: req.body.name, image: req.body.image };
                        const brand = await Brand.create(data);
                        return res.status(200).json({ message: "Brand add successfully.", status: 200, data: brand });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getBrand = async (req, res) => {
        try {
                const brand = await Brand.find({});
                return res.status(201).json({ success: true, brand, });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updateBrand = async (req, res) => {
        try {
                const { id } = req.params;
                const brand = await Brand.findById(id);
                if (!brand) {
                        return res.status(404).json({ message: "Brand Not Found", status: 404, data: {} });
                }
                if (req.file) {
                        brand.image = req.file.path;
                } else {
                        brand.image = brand.image;
                }
                brand.name = req.body.name;
                let update = await brand.save();
                return res.status(200).json({ message: "Updated Successfully", status: 200, data: update });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.removeBrand = async (req, res) => {
        const { id } = req.params;
        try {
                const brand = await Brand.findById(id);
                if (!brand) {
                        return res.status(404).json({ message: "Brand Not Found", status: 404, data: {} });
                } else {
                        await Brand.findByIdAndDelete(brand._id);
                        return res.status(200).json({ message: "Brand Deleted Successfully !" });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.createColorGender = async (req, res) => {
        try {
                let findBrand = await colorGender.findOne({ name: req.body.name, type: req.body.type });
                if (findBrand) {
                        return res.status(409).json({ message: `${req.body.type} already exit.`, status: 409, data: {} });
                } else {
                        const data = {
                                name: req.body.name,
                                type: req.body.type,
                        };
                        const category = await colorGender.create(data);
                        return res.status(200).json({ message: `${req.body.type} add successfully.`, status: 200, data: category });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getColorGender = async (req, res) => {
        try {
                const categories = await colorGender.find({});
                if (categories.length > 0) {
                        return res.status(201).json({ message: "Data Found", status: 200, data: categories, });
                }
                return res.status(201).json({ message: "Data not Found", status: 404, data: {}, });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getColorGenderBytype = async (req, res) => {
        try {
                const categories = await colorGender.find({ type: req.params.type });
                if (categories.length > 0) {
                        return res.status(201).json({ message: "Data Found", status: 200, data: categories, });
                }
                return res.status(201).json({ message: "Data not Found", status: 404, data: {}, });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updateColorGender = async (req, res) => {
        try {
                const { id } = req.params;
                const category = await colorGender.findById(id);
                if (!category) {
                        return res.status(404).json({ message: "Data Not Found", status: 404, data: {} });
                }
                category.name = req.body.name || category.name;
                category.type = category.type;;
                let update = await category.save();
                return res.status(200).json({ message: "Updated Successfully", data: update });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.removeColorGender = async (req, res) => {
        try {
                const { id } = req.params;
                const category = await colorGender.findById(id);
                if (!category) {
                        return res.status(404).json({ message: "Data Not Found", status: 404, data: {} });
                } else {
                        await colorGender.findByIdAndDelete(category._id);
                        return res.status(200).json({ message: "Data Deleted Successfully !" });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.AddShape = async (req, res) => {
        try {
                let findShape = await shape.findOne({ name: req.body.name, type: "shape" });
                if (findShape) {
                        return res.status(409).json({ message: "Shape already exit.", status: 404, data: {} });
                } else {
                        if (req.file) {
                                console.log(req.file);
                                req.body.image = req.file.path
                        } else {
                                return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                        }
                        const data = { name: req.body.name, image: req.body.image, type: "shape" };
                        const shape1 = await shape.create(data);
                        return res.status(200).json({ message: "Shape add successfully.", status: 200, data: shape1 });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getShape = async (req, res) => {
        try {
                const findShape = await shape.find({ type: "shape" });
                if (findShape.length > 0) {
                        return res.status(200).json({ success: true, data: findShape });
                } else {
                        return res.status(404).json({ message: "Shape not found.", status: 200, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updateShape = async (req, res) => {
        try {
                const { id } = req.params;
                const findShape = await shape.findById(id);
                if (!findShape) {
                        return res.status(404).json({ message: "Shape Not Found", status: 404, data: {} });
                }
                if (req.file) {
                        findShape.image = req.file.path
                } else {
                        findShape.image = shape.image;
                }
                findShape.name = req.body.name || findShape.name;
                findShape.type = findShape.type;
                let update = await findShape.save();
                return res.status(200).json({ message: "Updated Successfully", status: 200, data: update });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.removeShape = async (req, res) => {
        try {
                const { id } = req.params;
                const findShape = await shape.findById(id);
                if (!findShape) {
                        return res.status(404).json({ message: "Shape Not Found", status: 404, data: {} });
                } else {
                        await shape.findByIdAndDelete(findShape._id);
                        return res.status(200).json({ message: "Shape Deleted Successfully !" });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.AddStyle = async (req, res) => {
        try {
                let findShape = await shape.findOne({ name: req.body.name, type: "style" });
                if (findShape) {
                        return res.status(409).json({ message: "style already exit.", status: 404, data: {} });
                } else {
                        if (req.file) {
                                console.log(req.file);
                                req.body.image = req.file.path
                        } else {
                                return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                        }
                        const data = { name: req.body.name, image: req.body.image, type: "style" };
                        const shape1 = await shape.create(data);
                        return res.status(200).json({ message: "style add successfully.", status: 200, data: shape1 });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getStyle = async (req, res) => {
        try {
                const findShape = await shape.find({ type: "style" });
                if (findShape.length > 0) {
                        return res.status(200).json({ success: true, data: findShape });
                } else {
                        return res.status(404).json({ message: "style not found.", status: 200, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updateStyle = async (req, res) => {
        try {
                const { id } = req.params;
                const findShape = await shape.findById(id);
                if (!findShape) {
                        return res.status(404).json({ message: "style Not Found", status: 404, data: {} });
                }
                if (req.file) {
                        findShape.image = req.file.path
                } else {
                        findShape.image = shape.image;
                }
                findShape.name = req.body.name || findShape.name;
                findShape.type = findShape.type;
                let update = await findShape.save();
                return res.status(200).json({ message: "Updated Successfully", status: 200, data: update });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.removeStyle = async (req, res) => {
        try {
                const { id } = req.params;
                const findShape = await shape.findById(id);
                if (!findShape) {
                        return res.status(404).json({ message: "style Not Found", status: 404, data: {} });
                } else {
                        await shape.findByIdAndDelete(findShape._id);
                        return res.status(200).json({ message: "style Deleted Successfully !" });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.createAccessories = async (req, res) => {
        try {
                let findAccessories = await productModel.findOne({ name: req.body.name, type: 'accessories' });
                if (findAccessories) {
                        return res.status(409).json({ message: "Accessories already exit.", status: 404, data: {} });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path
                        } else {
                                return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                        }
                        const data = { name: req.body.name, price: req.body.price, image: req.body.image, type: 'accessories' };
                        const accessorie = await productModel.create(data);
                        return res.status(200).json({ message: "Accessories add successfully.", status: 200, data: accessorie });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getAccessories = async (req, res) => {
        try {
                const findShape = await productModel.find({ type: 'accessories' });
                if (findShape.length > 0) {
                        return res.status(200).json({ success: true, data: findShape });
                } else {
                        return res.status(404).json({ message: "Accessories not found.", status: 200, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updateAccessories = async (req, res) => {
        try {
                const { id } = req.params;
                const Accessoriess = await productModel.findById(id);
                if (!Accessoriess) {
                        return res.status(404).json({ message: "Accessories Not Found", status: 404, data: {} });
                }
                if (req.file) {
                        Accessoriess.image = req.file.path
                } else {
                        Accessoriess.image = Accessoriess.image;
                }
                Accessoriess.name = req.body.name || Accessoriess.name;
                Accessoriess.price = req.body.price || Accessoriess.price;
                Accessoriess.type = 'accessories';
                let update = await Accessoriess.save();
                return res.status(200).json({ message: "Updated Successfully", data: update });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.removeAccessories = async (req, res) => {
        try {
                const { id } = req.params;
                const findShape = await productModel.findById(id);
                if (!findShape) {
                        return res.status(404).json({ message: "Accessories Not Found", status: 404, data: {} });
                } else {
                        await productModel.findByIdAndDelete(findShape._id);
                        return res.status(200).json({ message: "Accessories Deleted Successfully !" });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.addContactDetails = async (req, res) => {
        try {
                console.log(req.body);
                let findcontactDetails = await ContactDetail.findOne({});
                if (findcontactDetails) {
                        if (req.file) {
                                req.body.image = req.file.path
                        } else {
                                req.body.image = findcontactDetails.image
                        }
                        req.body.title = req.body.title || findcontactDetails.title;
                        req.body.description = req.body.description || findcontactDetails.description;
                        req.body.fb = req.body.fb || findcontactDetails.fb;
                        req.body.instagram = req.body.instagram || findcontactDetails.instagram;
                        req.body.linkedIn = req.body.linkedIn || findcontactDetails.linkedIn;
                        req.body.twitter = req.body.twitter || findcontactDetails.twitter;
                        req.body.map = req.body.map || findcontactDetails.map;
                        req.body.mobileNumber = req.body.mobileNumber || findcontactDetails.mobileNumber;
                        req.body.mobileNumberDescription = req.body.mobileNumberDescription || findcontactDetails.mobileNumberDescription;
                        req.body.email = req.body.email || findcontactDetails.email;
                        req.body.emailDescription = req.body.emailDescription || findcontactDetails.emailDescription;
                        req.body.whatAppchat = req.body.whatAppchat || findcontactDetails.whatAppchat;
                        req.body.whatAppchatDescription = req.body.whatAppchatDescription || findcontactDetails.whatAppchatDescription;
                        let updateContact = await ContactDetail.findByIdAndUpdate({ _id: findcontactDetails._id }, { $set: req.body }, { new: true });
                        if (updateContact) {
                                return res.status(200).send({ status: 200, message: "Contact Detail update successfully", data: updateContact });
                        }
                } else {
                        if (req.file) {
                                req.body.image = req.file.path
                        }
                        console.log(req.body);
                        let result2 = await ContactDetail.create(req.body);
                        if (result2) {
                                return res.status(200).send({ status: 200, message: "Contact Detail update successfully", data: result2 });
                        }
                }
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ status: 500, msg: "internal server error", error: err.message, });
        }
};
exports.viewContactDetails = async (req, res) => {
        try {
                let findcontactDetails = await ContactDetail.findOne({});
                if (!findcontactDetails) {
                        return res.status(404).send({ status: 404, message: "Contact Detail not found.", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Contact Detail fetch successfully", data: findcontactDetails });
                }
        } catch (err) {
                console.log(err);
                return res.status(500).send({ status: 500, msg: "internal server error", error: err.message, });
        }
};
exports.createAboutUs = async (req, res) => {
        try {
                const { title, description, image, meetTheLeader, productDescription, products } = req.body;
                let findBanner = await static.findOne({ type: "ABOUTUS" });
                if (findBanner) {
                        if (req.file) {
                                req.body.image = req.file.path;
                        }
                        let data = {
                                title: title || findData.title,
                                image: req.body.image || findData.image,
                                productDescription: productDescription || findData.productDescription,
                                description: description || findData.description,
                                products: products || findData.products,
                                meetTheLeader: meetTheLeader || findData.meetTheLeader,
                                type: "ABOUTUS",
                        }
                        const newCategory = await static.findByIdAndUpdate({ _id: findBanner._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'About us update successfully', data: newCategory });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path;
                        }
                        req.body.type = "ABOUTUS";
                        const newCategory = await static.create(req.body);
                        return res.status(200).json({ status: 200, message: 'About us created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create About us' });
        }
};
exports.getAboutUsById = async (req, res) => {
        try {
                const bannerId = req.params.id;
                const user = await static.findById(bannerId);
                if (user) {
                        return res.status(201).json({ message: "About us found successfully", status: 200, data: user, });
                }
                return res.status(201).json({ message: "About us not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Banner" });
        }
};
exports.deleteAboutUs = async (req, res) => {
        try {
                const bannerId = req.params.id;
                const user = await static.findById(bannerId);
                if (user) {
                        const user1 = await static.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(201).json({ message: "About us delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(201).json({ message: "About us not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve About us" });
        }
};
exports.getAllAboutUs = async (req, res) => {
        try {
                const categories = await static.findOne();
                if (categories) {
                        return res.status(200).json({ status: 200, message: 'About us found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'About us not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch About us' });
        }
};
exports.addUserinAboutUs = async (req, res) => {
        try {
                const { degination, title, image } = req.body;
                let findBanner = await static.findOne({});
                if (findBanner) {
                        if (req.file) {
                                req.body.image = req.file.path;
                        }
                        let data = {
                                title: title,
                                degination: degination,
                                image: req.body.image
                        }
                        const newCategory = await static.findByIdAndUpdate({ _id: findBanner._id }, { $push: { meetLeader: data } }, { new: true });
                        return res.status(200).json({ status: 200, message: 'About us update successfully', data: newCategory });
                } else {
                        return res.status(200).json({ status: 200, message: 'About us not found.', data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create About us' });
        }
};
exports.deleteUserinAboutUs = async (req, res) => {
        try {
                let findCart = await static.findOne({});
                if (findCart) {
                        for (let i = 0; i < findCart.userArray.length; i++) {
                                if (findCart.userArray.length > 1) {
                                        if (((findCart.userArray[i]._id).toString() == req.params.id) == true) {
                                                let updateCart = await static.findByIdAndUpdate({ _id: findCart._id, 'userArray._id': req.params.id }, { $pull: { 'userArray': { _id: req.params.id, name: findCart.userArray[i].name, image: findCart.userArray[i].image, } } }, { new: true })
                                                if (updateCart) {
                                                        return res.status(200).send({ message: "User delete from bussiness we support.", data: updateCart, });
                                                }
                                        }
                                } else {
                                        return res.status(200).send({ status: 200, message: "No Data Found ", data: [] });
                                }
                        }
                } else {
                        return res.status(200).send({ status: 200, message: "No Data Found ", cart: [] });
                }

        } catch (error) {
                console.log("353====================>", error)
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.createFaq = async (req, res) => {
        const { question, answer } = req.body;
        try {
                if (!question || !answer) {
                        return res.status(400).json({ message: "questions and answers cannot be blank " });
                }
                const faq = await Faq.create(req.body);
                return res.status(200).json({ status: 200, message: "FAQ Added Successfully ", data: faq });
        } catch (err) {
                console.log(err);
                return res.status(500).json({ message: "Error ", status: 500, data: err.message });
        }
};
exports.getFaqById = async (req, res) => {
        const { id } = req.params;
        try {
                const faq = await Faq.findById(id);
                if (!faq) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "faqs retrieved successfully ", data: faq });
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.updateFaq = async (req, res) => {
        const { id } = req.params;
        try {
                const faq = await Faq.findByIdAndUpdate(id, req.body, { new: true });
                if (!faq) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "update successfully.", data: faq });
        } catch (err) {
                console.log(err);
                return res.status(500).json({ message: "Something went wrong ", status: 500, data: err.message });
        }
};
exports.deleteFaq = async (req, res) => {
        const { id } = req.params;
        try {
                const faq = await Faq.findByIdAndDelete(id);
                if (!faq) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "FAQ Deleted Successfully ", data: faq });
        } catch (err) {
                console.log(err);
                return res.status(500).json({ message: "Something went wrong ", status: 500, data: err.message });
        }
};
exports.getAllFaqs = async (req, res) => {
        try {
                const faqs = await Faq.find({}).lean();
                if (faqs.length == 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "faqs retrieved successfully ", data: faqs });
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.createPremiumLenses = async (req, res) => {
        try {
                const { name, description, image } = req.body;
                let findBanner = await premiumLenses.findOne({ name: name });
                if (findBanner) {
                        return res.status(200).json({ status: 200, message: 'Premium Lenses already exit', data: findBanner });
                }
                if (req.file) {
                        req.body.image = req.file.path;
                }
                const newCategory = await premiumLenses.create(req.body);
                return res.status(200).json({ status: 200, message: 'Premium Lenses created successfully', data: newCategory });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Premium Lenses' });
        }
};
exports.getPremiumLensesById = async (req, res) => {
        try {
                const bannerId = req.params.id;
                const user = await premiumLenses.findById(bannerId);
                if (user) {
                        return res.status(201).json({ message: "Premium Lenses found successfully", status: 200, data: user, });
                }
                return res.status(201).json({ message: "Premium Lenses not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve premiumLenses" });
        }
};
exports.deletePremiumLenses = async (req, res) => {
        try {
                const bannerId = req.params.id;
                const user = await premiumLenses.findById(bannerId);
                if (user) {
                        const user1 = await premiumLenses.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(201).json({ message: "Premium Lenses delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(201).json({ message: "Premium Lenses not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Premium Lenses" });
        }
};
exports.getAllPremiumLenses = async (req, res) => {
        try {
                const categories = await premiumLenses.findOne();
                if (categories) {
                        return res.status(200).json({ status: 200, message: 'Premium Lenses found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Premium Lenses not found.', data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Premium Lenses' });
        }
};
exports.createEyeTestCamp = async (req, res) => {
        try {
                const { applicationTitle, totalCamp, totalTest, description, image, applicationDescription } = req.body;
                let findBanner = await eyeTestCamp.findOne({ type: "Data" });
                if (findBanner) {
                        let image1 = [], image;
                        if (req.files) {
                                for (let i = 0; i < req.files.length; i++) {
                                        image1.push(req.files[i].path)
                                }
                        }
                        if (image1.length == 0) {
                                image = findBanner.image;
                        } else {
                                image = image1;
                        }
                        let obj = {
                                image: image,
                                description: description,
                                totalCamp: totalCamp,
                                totalTest: totalTest,
                                applicationTitle: applicationTitle,
                                applicationDescription: applicationDescription,
                        }
                        const faq = await eyeTestCamp.findByIdAndUpdate(findBanner._id, { $set: obj }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Eye Test Camp created successfully', data: faq });
                } else {
                        let image = [];
                        if (req.files) {
                                for (let i = 0; i < req.files.length; i++) {
                                        image.push(req.files[i].path)
                                }
                        }
                        req.body.image = image;
                        req.body.type = "Data";
                        const newCategory = await eyeTestCamp.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Eye Test Camp created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Eye Test Camp' });
        }
};
exports.getEyeTestCampById = async (req, res) => {
        try {
                const bannerId = req.params.id;
                const user = await eyeTestCamp.findById(bannerId);
                if (user) {
                        return res.status(201).json({ message: "Eye Test Camp found successfully", status: 200, data: user, });
                }
                return res.status(201).json({ message: "Eye Test Camp not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve premiumLenses" });
        }
};
exports.deleteEyeTestCamp = async (req, res) => {
        try {
                const bannerId = req.params.id;
                const user = await eyeTestCamp.findById(bannerId);
                if (user) {
                        const user1 = await eyeTestCamp.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(201).json({ message: "Eye Test Camp delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(201).json({ message: "Eye Test Camp not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Eye Test Camp" });
        }
};
exports.getAllEyeTestCamp = async (req, res) => {
        try {
                const categories = await eyeTestCamp.findOne({ type: "Data" });
                if (categories) {
                        return res.status(200).json({ status: 200, message: 'Eye Test Camp found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Eye Test Camp not found.', data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Eye Test Camp' });
        }
};
exports.getAllEyeTestCampFormData = async (req, res) => {
        try {
                const categories = await eyeTestCamp.find({ type: "form" });
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Eye Test Camp found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Eye Test Camp not found.', data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Eye Test Camp' });
        }
};
exports.createFranchiseTestimonial = async (req, res) => {
        try {
                let findBrand = await franchiseTestimonial.findOne({ label: req.body.label });
                if (findBrand) {
                        return res.status(409).json({ message: `${req.body.type} already exit.`, status: 409, data: {} });
                } else {
                        let fileUrl;
                        if (req.file) {
                                fileUrl = req.file ? req.file.path : "";
                        } else {
                                return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                        }
                        const data = {
                                link: req.body.link,
                                label: req.body.label,
                                image: fileUrl,
                        };
                        const category = await franchiseTestimonial.create(data);
                        return res.status(200).json({ message: `${req.body.type} add successfully.`, status: 200, data: category });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getFranchiseTestimonial = async (req, res) => {
        const categories = await franchiseTestimonial.find({});
        if (categories.length > 0) {
                return res.status(201).json({ message: "Data Found", status: 200, data: categories, });
        }
        return res.status(201).json({ message: "Data not Found", status: 404, data: {}, });

};
exports.updateFranchiseTestimonial = async (req, res) => {
        const { id } = req.params;
        const category = await franchiseTestimonial.findById(id);
        if (!category) {
                return res.status(404).json({ message: "Data Not Found", status: 404, data: {} });
        }
        let fileUrl;
        if (req.file) {
                fileUrl = req.file ? req.file.path : "";
        } else {
                fileUrl = category.image;
        }
        category.link = req.body.link || category.link;
        category.label = req.body.label || category.label;
        category.image = fileUrl;
        let update = await category.save();
        return res.status(200).json({ message: "Updated Successfully", data: update });
};
exports.removeFranchiseTestimonial = async (req, res) => {
        const { id } = req.params;
        const category = await franchiseTestimonial.findById(id);
        if (!category) {
                return res.status(404).json({ message: "Data Not Found", status: 404, data: {} });
        } else {
                await franchiseTestimonial.findByIdAndDelete(category._id);
                return res.status(200).json({ message: "Data Deleted Successfully !" });
        }
};
exports.getAllFranchiseInquiryData = async (req, res) => {
        try {
                const categories = await franchiseInquiry.find({});
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Franchise Inquiry found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Franchise Inquiry not found.', data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Franchise Inquiry' });
        }
};
exports.addFranchise = async (req, res) => {
        try {
                const findData = await franchise.findOne({});
                if (findData) {
                        let images = [];
                        if (req.files['image1']) {
                                let image = req.files['image1'];
                                req.body.image1 = image[0].path;
                        }
                        if (req.files['image']) {
                                let imagess = req.files['image'];
                                for (let i = 0; i < imagess.length; i++) {
                                        images.push(imagess[i].path)
                                }
                        }
                        const data = {
                                image1: req.body.image1,
                                image: images,
                                title: req.body.title || findData.title,
                                description: req.body.description || findData.description,
                                email: req.body.email || findData.email,
                                phone: req.body.phone || findData.phone,
                        }
                        const Data = await franchise.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: "Franchise is Added ", data: Data })
                } else {
                        let images = [];
                        if (req.files['image1']) {
                                let image = req.files['image1'];
                                req.body.image1 = image[0].path;
                        }
                        if (req.files['image']) {
                                let imagess = req.files['image'];
                                for (let i = 0; i < imagess.length; i++) {
                                        images.push(imagess[i].path)
                                }
                        }
                        const data = {
                                image1: req.body.image1,
                                image: images,
                                title: req.body.title,
                                description: req.body.description,
                                email: req.body.email,
                                phone: req.body.phone,
                        }
                        const Data = await franchise.create(data);
                        return res.status(200).json({ status: 200, message: "Franchise is Added ", data: Data })
                }
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getFranchise = async (req, res) => {
        try {
                const Ads = await franchise.findOne();
                if (!Ads) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                } else {
                        return res.status(200).json({ status: 200, message: "All Franchise Data found successfully.", data: Ads })
                }
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getFranchiseById = async (req, res) => {
        try {
                const Ads = await franchise.findById({ _id: req.params.id });
                if (!Ads) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: Ads })
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.DeleteFranchise = async (req, res) => {
        try {
                const Ads = await franchise.findById({ _id: req.params.id });
                if (!Ads) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                await franchise.findByIdAndDelete({ _id: req.params.id });
                return res.status(200).json({ status: 200, message: "Franchise delete successfully.", data: {} })
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.createProduct = async (req, res, next) => {
        try {
                let images = [], featuresImages = [];
                if (req.files['images']) {
                        let imagess = req.files['images'];
                        for (let i = 0; i < imagess.length; i++) {
                                images.push(imagess[i].path)
                        }
                }
                if (req.files['featureImage']) {
                        let imagess = req.files['featureImage'];
                        for (let i = 0; i < imagess.length; i++) {
                                featuresImages.push(imagess[i].path)
                        }
                }
                req.body.images = images;
                req.body.featuresImage = featuresImages;
                // const data = {
                //         name: req.body.name,
                //         description: req.body.description,
                //         price: req.body.price,
                //         type: req.body.type,
                //         quantity: req.body.quantity,
                //         images: images,
                //         category: req.body.category,
                //         subcategory: req.body.subcategory,
                //         stock: req.body.stock,
                // };
                if (req.body.discountActive == 'true') {
                        req.body.discountPer = req.body.discountPer;
                }
                req.body.type = "product";
                const product = await productModel.create(req.body);
                return res.status(200).json({ message: "product add successfully.", status: 200, data: product, });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getProducts = async (req, res) => {
        try {
                const Ads = await productModel.find({ type: "product" });
                if (Ads.length == 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                } else {
                        return res.status(200).json({ status: 200, message: "All Product Data found successfully.", data: Ads })
                }
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getProductDetails = async (req, res, next) => {
        try {
                const product = await productModel.findById(req.params.id);
                if (!product) {
                        return next(new ErrorHander("Product not found", 404));
                }
                return res.status(200).json({ status: 200, message: "Product Data found successfully.", data: product })
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.deleteProducts = async (req, res) => {
        try {
                const Ads = await productModel.findById({ _id: req.params.id });
                if (!Ads) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                await productModel.findByIdAndDelete({ _id: req.params.id });
                return res.status(200).json({ status: 200, message: "Product delete successfully.", data: {} })
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
}
exports.sendNotification = async (req, res) => {
        try {
                const admin = await User.findById({ _id: req.user._id });
                if (!admin) {
                        return res.status(404).json({ status: 404, message: "Admin not found" });
                } else {
                        if (req.body.total == "ALL") {
                                let userData = await User.find({ userType: req.body.sendTo });
                                if (userData.length == 0) {
                                        return res.status(404).json({ status: 404, message: "User not found" });
                                } else {
                                        for (let i = 0; i < userData.length; i++) {
                                                if (userData.deviceToken != null || userData.deviceToken != undefined) {
                                                        let result = await commonFunction.pushNotificationforUser(userData[i].deviceToken, req.body.title, req.body.body);
                                                        let obj = {
                                                                userId: userData[i]._id,
                                                                title: req.body.title,
                                                                body: req.body.body,
                                                                date: req.body.date,
                                                                image: req.body.image,
                                                                time: req.body.time,
                                                        }
                                                        await notification.create(obj)
                                                        let obj1 = {
                                                                userId: admin._id,
                                                                title: req.body.title,
                                                                body: req.body.body,
                                                                date: req.body.date,
                                                                image: req.body.image,
                                                                time: req.body.time,
                                                        }
                                                        await notification.create(obj1)
                                                        return res.status(200).json({ status: 200, message: "Notification send successfully." });
                                                } else {
                                                        let obj = {
                                                                userId: userData[i]._id,
                                                                title: req.body.title,
                                                                body: req.body.body,
                                                                date: req.body.date,
                                                                image: req.body.image,
                                                                time: req.body.time,
                                                        }
                                                        await notification.create(obj)
                                                        let obj1 = {
                                                                userId: admin._id,
                                                                title: req.body.title,
                                                                body: req.body.body,
                                                                date: req.body.date,
                                                                image: req.body.image,
                                                                time: req.body.time,
                                                        }
                                                        await notification.create(obj1)
                                                        return res.status(200).json({ status: 200, message: "Notification send successfully." });
                                                }
                                        }
                                }
                        }
                        if (req.body.total == "SINGLE") {
                                let userData = await User.findById({ _id: req.body._id, userType: req.body.sendTo });
                                if (!userData) {
                                        return res.status(404).json({ status: 404, message: "Employee not found" });
                                } else {
                                        if (userData.deviceToken != null || userData.deviceToken != undefined) {
                                                let result = await commonFunction.pushNotificationforUser(userData.deviceToken, req.body.title, req.body.body);
                                                let obj = {
                                                        userId: userData._id,
                                                        title: req.body.title,
                                                        body: req.body.body,
                                                        date: req.body.date,
                                                        image: req.body.image,
                                                        time: req.body.time,
                                                }
                                                let data = await notification.create(obj)
                                                if (data) {
                                                        let obj1 = {
                                                                userId: admin._id,
                                                                title: req.body.title,
                                                                body: req.body.body,
                                                                date: req.body.date,
                                                                image: req.body.image,
                                                                time: req.body.time,
                                                        }
                                                        await notification.create(obj1)
                                                        return res.status(200).json({ status: 200, message: "Notification send successfully.", data: data });
                                                }
                                        } else {
                                                let obj = {
                                                        userId: userData._id,
                                                        title: req.body.title,
                                                        body: req.body.body,
                                                        date: req.body.date,
                                                        image: req.body.image,
                                                        time: req.body.time,
                                                }
                                                let data = await notification.create(obj)
                                                if (data) {
                                                        let obj1 = {
                                                                userId: admin._id,
                                                                title: req.body.title,
                                                                body: req.body.body,
                                                                date: req.body.date,
                                                                image: req.body.image,
                                                                time: req.body.time,
                                                        }
                                                        await notification.create(obj1)
                                                        return res.status(200).json({ status: 200, message: "Notification send successfully.", data: data });
                                                }
                                        }
                                }
                        }
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
}
exports.allNotification = async (req, res) => {
        try {
                const admin = await User.findById({ _id: req.user._id });
                if (!admin) {
                        return res.status(404).json({ status: 404, message: "Admin not found" });
                } else {
                        let findNotification = await notification.find({ userId: admin._id }).populate('userId');
                        if (findNotification.length == 0) {
                                return res.status(404).json({ status: 404, message: "Notification data not found successfully.", data: {} })
                        } else {
                                return res.status(200).json({ status: 200, message: "Notification data found successfully.", data: findNotification })
                        }
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
}
exports.getOrder = async (req, res, next) => {
        try {
                if (req.query.orderStatus != (null || undefined)) {
                        const cart = await userOrders.find({ orderStatus: req.query.orderStatus }).populate('products.productId');
                        if (cart.length == 0) {
                                return res.status(404).json({ message: 'Orders not found for the specified user.' });
                        }
                        return res.status(200).json({ success: true, msg: "Orders retrieved successfully", data: cart });
                } else {
                        const cart = await userOrders.find({ orderStatus: "confirmed" }).populate('products.productId')
                        if (cart.length == 0) {
                                return res.status(404).json({ message: 'Orders not found for the specified user.' });
                        }
                        return res.status(200).json({ success: true, msg: "Orders retrieved successfully", data: cart });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal server error' });
        }
};
exports.updateOrderStatus = async (req, res) => {
        try {
                const orders = await userOrders.findById({ _id: req.params.id });
                if (!orders) {
                        return res.status(404).json({ status: 404, message: "Orders not found", data: {} });
                } else {
                        const update = await userOrders.findByIdAndUpdate({ _id: orders._id }, { $set: { orderStatus: req.body.orderStatus } }, { new: true });
                        return res.status(200).json({ status: 200, msg: "orders of user", data: update })
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.createPrivacy = async (req, res) => {
        try {
                if (!req.body.privacy) {
                        return res.status(400).send("please specify privacy");
                }
                const result = await static.create({ privacy: req.body.privacy, type: "PRIVACY" });
                return res.status(200).json({ status: 200, message: "Data create successfully.", data: result });
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.updatePrivacy = async (req, res) => {
        try {
                const data = await static.findOne({ _id: req.params.id, type: "PRIVACY" });
                if (!data) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                } else {
                        let privacy = req.body.privacy || data.privacy;
                        const data1 = await static.findByIdAndUpdate({ _id: data._id }, { privacy: privacy, type: data.type }, { new: true, });
                        return res.status(200).json({ status: 200, message: "update successfully.", data: data1 });
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getPrivacy = async (req, res) => {
        try {
                const data = await static.find({ type: "PRIVACY" });
                if (data.length == 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: data });
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getPrivacybyId = async (req, res) => {
        try {
                const data = await static.findById(req.params.id);
                if (!data || data.length === 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: data });
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.deletePrivacy = async (req, res) => {
        try {
                const data = await static.findByIdAndDelete(req.params.id);
                if (!data) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Deleted Successfully", });
        } catch (err) {
                console.log(err.message);
                return res.status(500).send({ msg: "internal server error", error: err.message });
        }
};
exports.createRefundPrivacy = async (req, res) => {
        try {
                const data = await static.findOne({ type: "REFUNDPRIVACY" });
                if (!data) {
                        if (!req.body.privacy) {
                                return res.status(400).send("please specify privacy");
                        }
                        const result = await static.create({ privacy: req.body.privacy, type: "REFUNDPRIVACY" });
                        return res.status(200).json({ status: 200, message: "Data create successfully.", data: result });
                } else {
                        let privacy = req.body.privacy || data.privacy;
                        const data1 = await static.findByIdAndUpdate({ _id: data._id }, { privacy: privacy, type: data.type }, { new: true, });
                        return res.status(200).json({ status: 200, message: "update successfully.", data: data1 });
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getRefundPrivacy = async (req, res) => {
        try {
                const data = await static.findOne({ type: "REFUNDPRIVACY" });
                if (!data || data.length === 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: data });
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};