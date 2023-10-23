const User = require("../Model/userModel");
const storeModel = require("../Model/store");
const Banner = require('../Model/bannerModel')
const Brand = require("../Model/brandModel");
const Category = require("../Model/categoryModel");
const Subcategory = require("../Model/subCategoryModel");
const offer = require('../Model/offerModel')
const accessories = require('../Model/accessoriesModel')
const recommendeYoutube = require("../Model/recommende&youtubeCornerByBanner");
const colorGender = require("../Model/colorGender");
const shape = require("../Model/shape");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
                let findShape = await shape.findOne({ name: req.body.name });
                if (findShape) {
                        return res.status(409).json({ message: "Shape already exit.", status: 404, data: {} });
                } else {
                        if (req.file) {
                                console.log(req.file);
                                req.body.image = req.file.path
                        } else {
                                return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                        }
                        const data = { name: req.body.name, image: req.body.image };
                        const shape1 = await shape.create(data);
                        return res.status(200).json({ message: "Shape add successfully.", status: 200, data: shape1 });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getShape = async (req, res) => {
        try {
                const findShape = await shape.find();
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
exports.createAccessories = async (req, res) => {
        try {
                let findAccessories = await accessories.findOne({ name: req.body.name });
                if (findAccessories) {
                        return res.status(409).json({ message: "Accessories already exit.", status: 404, data: {} });
                } else {
                        if (req.file) {
                                console.log(req.file);
                                req.body.image = req.file.path
                        } else {
                                return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                        }
                        const data = { name: req.body.name, price: req.body.price, image: req.body.image };
                        const accessorie = await accessories.create(data);
                        return res.status(200).json({ message: "Accessories add successfully.", status: 200, data: accessorie });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getAccessories = async (req, res) => {
        try {
                const findShape = await accessories.find();
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
                const Accessoriess = await accessories.findById(id);
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
                let update = await Accessoriess.save();
                return res.status(200).json({ message: "Updated Successfully", data: update });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.removeAccessories = async (req, res) => {
        try {
                const { id } = req.params;
                const findShape = await accessories.findById(id);
                if (!findShape) {
                        return res.status(404).json({ message: "Accessories Not Found", status: 404, data: {} });
                } else {
                        await shape.findByIdAndDelete(findShape._id);
                        return res.status(200).json({ message: "Accessories Deleted Successfully !" });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};