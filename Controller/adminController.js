const User = require("../Model/userModel");
const storeModel = require("../Model/store");
const recommendeYoutube = require("../Model/recommende&youtubeCornerByBanner");
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
                        }
                        let saveStore = await storeModel(req.body).save();
                        if (saveStore) {
                                res.json({ status: 200, message: 'Store add successfully.', data: saveStore });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error" + error.message });
        }
};
exports.viewStore = async (req, res) => {
        try {
                let findStore = await storeModel.findOne({ _id: req.params.id }).populate('vendorId');
                if (!findStore) {
                        return res.status(404).send({ status: 404, message: "Data not found" });
                } else {
                        res.json({ status: 200, message: 'Store found successfully.', data: findStore });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error" + error.message });
        }
};
exports.editStore = async (req, res) => {
        try {
                let findStore = await storeModel.findOne({ _id: req.params._id });
                if (!findStore) {
                        return res.status(404).send({ status: 404, message: "Data not found" });
                } else {
                        if (req.file) {
                                req.body.storeImage = req.file.filename
                        }
                        let saveStore = await storeModel.findByIdAndUpdate({ _id: findStore._id }, { $set: req.body }, { new: true })
                        if (saveStore) {
                                res.json({ status: 200, message: 'Store update successfully.', data: saveStore });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error" + error.message });
        }
};
exports.deleteStore = async (req, res) => {
        try {
                let vendorData = await User.findOne({ _id: req.user._id, userType: "VENDOR" });
                if (!vendorData) {
                        return res.status(404).send({ status: 404, message: "User not found" });
                } else {
                        let findStore = await storeModel.findOne({ _id: req.params.id });
                        if (!findStore) {
                                return res.status(404).send({ status: 404, message: "Data not found" });
                        } else {
                                let update = await storeModel.findByIdAndDelete({ _id: findStore._id });
                                if (update) {
                                        res.json({ status: 200, message: 'Store Delete successfully.', data: findStore });
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
                        res.json({ status: 200, message: 'Store Data found successfully.', data: findStore });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error" + error.message });
        }
};