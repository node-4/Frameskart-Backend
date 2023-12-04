const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Banner = require('../ModelNew/bannerModel')
const Brand = require("../ModelNew/brandModel");
const Category = require("../ModelNew/categoryModel");
const colorGender = require("../ModelNew/colorGender");
const ContactDetail = require("../ModelNew/contactDetails");
const eyeTestCamp = require("../ModelNew/eyeTestCamp");
const Faq = require('../ModelNew/faq')
const frame = require('../ModelNew/frame')
const Guide = require("../ModelNew/Guides/guide")
const notification = require("../ModelNew/notification");
const recommendeYoutube = require("../ModelNew/recommende&youtubeCornerByBanner");
const offer = require('../ModelNew/offerModel')
const static = require("../ModelNew/static");
const shape = require("../ModelNew/shape");
const Subcategory = require("../ModelNew/subCategoryModel");
const User = require("../ModelNew/userModel");
const userOrders = require("../ModelNew/userOrders");
const franchiseInquiry = require("../ModelNew/FranchiseRegistration/franchiseInquiry");
const franchise = require("../ModelNew/FranchiseRegistration/franchise");
const franchiseTestimonial = require("../ModelNew/FranchiseRegistration/franchiseTestimonial");
const visionTest = require("../ModelNew/visionTest/visionTest");
const visionTestQuestion = require("../ModelNew/visionTest/visionTestQuestion");
const Subscription = require("../ModelNew/subscription");
const lens = require("../ModelNew/Lens/lens");
const powerTypeCategory = require("../ModelNew/Lens/powerTypeCategory");
const powerTypeSubCategory = require("../ModelNew/Lens/powerTypeSubCategory");
const product = require("../ModelNew/productModel");
const bottomCard = require("../ModelNew/bottomCard");
const premiumLenses = require("../ModelNew/premiumLenses");
const storeModel = require("../ModelNew/store");

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
exports.getProfile = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user.id, userType: "Admin" });
                if (!user) {
                        return res.status(404).send({ message: "user not found ! not registered" });
                }

                return res.status(201).send({ data: user });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Server error" + error.message });
        }
};
exports.updateProfile = async (req, res) => {
        try {
                const { fullName, firstName, lastName, mobileNumber, email } = req.body;
                const user = await User.findOne({ _id: req.user.id, userType: "Admin" });
                if (!user) {
                        return res.status(404).send({ message: "user not found ! not registered" });
                }
                if (user.email !== email) {
                        let user1 = await User.findOne({ email: email, userType: "Admin" });
                        if (user1) {
                                return res.status(409).send({ message: "Already Exist", data: [] });
                        }
                }
                if (user.mobileNumber !== mobileNumber) {
                        let user1 = await User.findOne({ mobileNumber: mobileNumber, userType: "Admin" });
                        if (user1) {
                                return res.status(409).send({ message: "Already Exist", data: [] });
                        }
                }
                if (req.file) {
                        req.body.photo = req.file.path;
                } else {
                        req.body.photo = user.photo;
                }
                let obj = {
                        fullName: fullName,
                        firstName: firstName,
                        lastName: lastName,
                        mobileNumber: mobileNumber,
                        email: email,
                        photo: req.body.photo,
                }
                const userUpdate = await User.findByIdAndUpdate({ _id: req.user.id, userType: "Admin" }, obj, { new: true });
                return res.status(201).send({ data: userUpdate });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Server error" + error.message });
        }
};
exports.changePassword = async (req, res) => {
        try {
                const { oldPassword, newPassword } = req.body;
                const user = await User.findOne({ _id: req.user.id, userType: "Admin" });
                if (!user) {
                        return res.status(404).send({ message: "user not found ! not registered" });
                }
                const isValidPassword = bcrypt.compareSync(oldPassword, user.password);
                if (!isValidPassword) {
                        return res.status(401).send({ message: "Wrong password" });
                }
                let obj = {
                        password: bcrypt.hashSync(newPassword, 8),
                }
                const userUpdate = await User.findByIdAndUpdate({ _id: req.user.id, userType: "Admin" }, obj, { new: true });
                return res.status(201).send({ data: userUpdate });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Server error" + error.message });
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
                const { title, description, image, focusDescription, focusTitle, meetTheLeader, productDescription, products } = req.body;
                let findBanner = await static.findOne({ type: "ABOUTUS" });
                if (findBanner) {
                        if (req.file) {
                                req.body.image = req.file.path;
                        }
                        let data = {
                                title: title || findBanner.title,
                                image: req.body.image || findBanner.image,
                                productDescription: productDescription || findBanner.productDescription,
                                description: description || findBanner.description,
                                products: products || findBanner.products,
                                meetTheLeader: meetTheLeader || findBanner.meetTheLeader,
                                focusDescription: focusDescription || findBanner.focusDescription,
                                focusTitle: focusTitle || findBanner.focusTitle,
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
                                                }
                                        }
                                        return res.status(200).json({ status: 200, message: "Notification send successfully." });
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
                        return res.status(200).json({ status: 200, msg: "Orders retrieved successfully", data: cart });
                } else {
                        const cart = await userOrders.find({ orderStatus: "confirmed" }).populate('products.productId')
                        if (cart.length == 0) {
                                return res.status(404).json({ message: 'Orders not found for the specified user.' });
                        }
                        return res.status(200).json({ status: 200, msg: "Orders retrieved successfully", data: cart });
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
exports.createTerms = async (req, res) => {
        try {
                if (!req.body.terms) {
                        return res.status(400).send("please specify terms");
                }
                const result = await static.create({ terms: req.body.terms, type: "TERMS" });
                return res.status(200).json({ status: 200, message: "Data create successfully.", data: result });
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.updateTerms = async (req, res) => {
        try {
                const data = await static.findOne({ _id: req.params.id, type: "TERMS" });
                if (!data) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                } else {
                        let terms = req.body.terms || data.terms;
                        const data1 = await static.findByIdAndUpdate({ _id: data._id }, { terms: terms, type: data.type }, { new: true, });
                        return res.status(200).json({ status: 200, message: "update successfully.", data: data1 });
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getTerms = async (req, res) => {
        try {
                const data = await static.find({ type: "TERMS" });
                if (data.length == 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: data });
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getTermsbyId = async (req, res) => {
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
exports.deleteTerms = async (req, res) => {
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
exports.createCategory = async (req, res) => {
        try {
                let findCategory = await Category.findOne({ name: req.body.name, type: req.body.type });
                if (findCategory) {
                        return res.status(409).json({ message: "category already exit.", status: 404, data: {} });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path
                        } else {
                                return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                        }
                        const data = { name: req.body.name, image: req.body.image, type: req.body.type };
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
                        return res.status(200).json({ status: 200, message: "Category found.", Category: updateOffer });
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
exports.getMainCategories = async (req, res) => {
        try {
                const updateOffer = await Category.find({ type: "Main" });
                if (updateOffer.length > 0) {
                        return res.status(200).json({ status: 200, message: "Category found.", Category: updateOffer });
                } else {
                        return res.status(404).json({ message: "Category not found.", status: 200, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getFramesKartSmartSeriesCategories = async (req, res) => {
        try {
                const updateOffer = await Category.find({ type: "FramesKartSmartSeries" });
                if (updateOffer.length > 0) {
                        return res.status(200).json({ status: 200, message: "Category found.", Category: updateOffer });
                } else {
                        return res.status(404).json({ message: "Category not found.", status: 200, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getPremiumEyeWearCategories = async (req, res) => {
        try {
                const updateOffer = await Category.find({ type: "PremiumEyeWear" });
                if (updateOffer.length > 0) {
                        return res.status(200).json({ status: 200, message: "Category found.", Category: updateOffer });
                } else {
                        return res.status(404).json({ message: "Category not found.", status: 200, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getPremiumLensCategories = async (req, res) => {
        try {
                const updateOffer = await Category.find({ type: "PremiumLens" });
                if (updateOffer.length > 0) {
                        return res.status(200).json({ status: 200, message: "Category found.", Category: updateOffer });
                } else {
                        return res.status(404).json({ message: "Category not found.", status: 200, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getFramesKartSeriesCategories = async (req, res) => {
        try {
                const updateOffer = await Category.find({ type: "FramesKartSeries" });
                if (updateOffer.length > 0) {
                        return res.status(200).json({ status: 200, message: "Category found.", Category: updateOffer });
                } else {
                        return res.status(404).json({ message: "Category not found.", status: 200, data: {} });
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
                        if (req.file) {
                                req.body.image = req.file.path
                        }
                        const data = { name: req.body.name, categoryId: req.body.categoryId, image: req.body.image };
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
                        return res.status(200).json({ status: 200, message: "Subcategory found.", Subcategory: updateOffer });
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
                if (req.file) {
                        updateOffer.image = req.file.path
                } else {
                        updateOffer.image = updateOffer.image;
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
exports.AddBanner = async (req, res) => {
        try {
                let findBanner = await Banner.findOne({ name: req.body.name, type: req.body.type });
                if (findBanner) {
                        if (findBanner.type == "tryGlasses") {
                                if (req.file) {
                                        req.body.image = req.file.path
                                } else {
                                        return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                                }
                                const data = { name: req.body.name, image: req.body.image, link: req.body.link, type: "tryGlasses" };
                                const banner = await Banner.findByIdAndUpdate({ _id: findBanner._id }, { $set: data }, { new: true });
                                return res.status(200).json({ message: "Banner add successfully.", status: 200, data: banner });
                        } else if (findBanner.type == "ContactLens") {
                                if (req.file) {
                                        req.body.image = req.file.path
                                } else {
                                        return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                                }
                                const data = { name: req.body.name, image: req.body.image, link: req.body.link, type: "ContactLens" };
                                const banner = await Banner.findByIdAndUpdate({ _id: findBanner._id }, { $set: data }, { new: true });
                                return res.status(200).json({ message: "Banner add successfully.", status: 200, data: banner });
                        } else {
                                return res.status(409).json({ message: "Banner already exit.", status: 404, data: {} });
                        }
                } else {
                        if (req.file) {
                                req.body.image = req.file.path
                        } else {
                                return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                        }
                        const data = { name: req.body.name, image: req.body.image, link: req.body.link, type: req.body.type };
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
                        return res.status(200).json({ status: 200, data: banners });
                } else {
                        return res.status(404).json({ message: "Banner not found.", status: 200, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getBannerByType = async (req, res) => {
        try {
                const banners = await Banner.find({ type: req.params.type });
                if (banners.length > 0) {
                        return res.status(200).json({ status: 200, data: banners });
                } else {
                        return res.status(404).json({ message: "Banner not found.", status: 200, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getBannerBytryGlassesContactLens = async (req, res) => {
        try {
                const banners = await Banner.find({ type: ["tryGlasses", "ContactLens"] });
                if (banners.length > 0) {
                        return res.status(200).json({ status: 200, data: banners });
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
                banner.type = req.body.type || banner.type;
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
exports.createBrand = async (req, res) => {
        try {
                let findBrand = await Brand.findOne({ name: req.body.name });
                if (findBrand) {
                        return res.status(409).json({ message: "Brand already exit.", status: 404, data: {} });
                } else {
                        if (req.files['image']) {
                                let image = req.files['image'];
                                req.body.image = image[0].path;
                        }
                        if (req.files['logo']) {
                                let imagess = req.files['logo'];
                                req.body.logo = imagess[0].path;
                        }
                        const data = { name: req.body.name, image: req.body.image, logo: req.body.logo };
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
                if (brand.length > 0) {
                        return res.status(200).json({ status: 200, message: "Brand found.", data: brand });
                } else {
                        return res.status(404).json({ status: 404, message: "Brand not found.", data: {} });
                }
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
                if (req.files['image']) {
                        let image = req.files['image'];
                        req.body.image = image[0].path;
                } else {
                        brand.image = brand.image;
                }
                if (req.files['logo']) {
                        let imagess = req.files['logo'];
                        req.body.logo = imagess[0].path;
                } else {
                        brand.logo = brand.logo;
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
                        return res.status(200).json({ status: 200, message: "shape found.", data: findShape });
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
                        return res.status(200).json({ status: 200, message: "Style found.", data: findShape });
                } else {
                        return res.status(404).json({ message: "style not found.", status: 404, data: {} });
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
exports.getAlluser = async (req, res) => {
        try {
                const categories = await User.find({ userType: "User" });
                if (categories.length > 0) {
                        return res.status(201).json({ message: "Data Found", status: 200, data: categories, });
                }
                return res.status(201).json({ message: "Data not Found", status: 404, data: {}, });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message });
        }
};
exports.getuserById = async (req, res) => {
        try {
                const categories = await User.findById(req.params.id);
                if (categories) {
                        return res.status(201).json({ message: "Data Found", status: 200, data: categories, });
                }
                return res.status(201).json({ message: "Data not Found", status: 404, data: {}, });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message });
        }
};
exports.deleteUser = async (req, res) => {
        try {
                const categories = await User.findById(req.params.id);
                if (categories) {
                        const categories = await User.findByIdAndDelete(req.params.id);
                        if (categories) {
                                return res.status(201).json({ message: "Data Deleted Successfully", status: 200, data: {}, });
                        }
                }
                return res.status(201).json({ message: "Data not Found", status: 404, data: {}, });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message });
        }
}
exports.addFcash = async (req, res) => {
        try {
                const categories = await User.findById(req.params.id);
                if (categories) {
                        categories.esCash = Number(categories.esCash) + Number(req.body.esCash);
                        const categories1 = await categories.save();
                        return res.status(200).json({ message: "Add fcash to user walllet Successfully", status: 200, data: categories1 });
                }
                return res.status(404).json({ message: "Data not Found", status: 404, data: {}, });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.AddVisionTest = async (req, res) => {
        try {
                let findVisionTest = await visionTest.findOne({ name: req.body.name });
                if (findVisionTest) {
                        if (req.file) {
                                req.body.image = req.file.path
                        } else {
                                req.body.image = findVisionTest.image;
                        }
                        const data = { name: req.body.name, image: req.body.image, };
                        const Saved = await visionTest.findByIdAndUpdate({ _id: findVisionTest._id }, { $set: data }, { new: true });
                        return res.status(200).json({ message: "VisionTest add successfully.", status: 200, data: Saved });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path
                        } else {
                                return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                        }
                        const data = { name: req.body.name, image: req.body.image };
                        const Saved = await visionTest.create(data);
                        return res.status(200).json({ message: "VisionTest add successfully.", status: 200, data: Saved });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getVisionTest = async (req, res) => {
        try {
                const findVisionTest = await visionTest.find();
                if (findVisionTest.length > 0) {
                        return res.status(200).json({ status: 200, data: findVisionTest });
                } else {
                        return res.status(404).json({ message: "VisionTest not found.", status: 200, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updateVisionTest = async (req, res) => {
        try {
                const { id } = req.params;
                const findVisionTest = await visionTest.findById(id);
                if (!findVisionTest) {
                        return res.status(404).json({ message: "VisionTest Not Found", status: 404, data: {} });
                }
                if (req.file) {
                        findVisionTest.image = req.file.path
                } else {
                        findVisionTest.image = findVisionTest.image;
                }
                findVisionTest.name = req.body.name;
                let update = await findVisionTest.save();
                return res.status(200).json({ message: "Updated Successfully", status: 200, data: update });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.removeVisionTest = async (req, res) => {
        try {
                const { id } = req.params;
                const findVisionTest = await visionTest.findById(id);
                if (!findVisionTest) {
                        return res.status(404).json({ message: "VisionTest Not Found", status: 404, data: {} });
                } else {
                        await visionTest.findByIdAndDelete(findVisionTest._id);
                        return res.status(200).json({ message: "VisionTest Deleted Successfully !" });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.addInstructionInVisionTest = async (req, res) => {
        try {
                const { name, image } = req.body;
                let findBanner = await visionTest.findOne({ _id: req.params.visionTestId });
                if (findBanner) {
                        if (req.file) {
                                req.body.image = req.file.path;
                        }
                        let data = {
                                name: name,
                                image: req.body.image
                        }
                        const newCategory = await visionTest.findByIdAndUpdate({ _id: findBanner._id }, { $push: { instruction: data } }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Vision test update successfully', data: newCategory });
                } else {
                        return res.status(200).json({ status: 200, message: 'Vision test not found.', data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Vision test' });
        }
};
exports.deleteInstructionInVisionTest = async (req, res) => {
        try {
                let findCart = await visionTest.findOne({ _id: req.params.visionTestId });
                if (findCart) {
                        for (let i = 0; i < findCart.instruction.length; i++) {
                                if (findCart.instruction.length > 1) {
                                        if (((findCart.instruction[i]._id).toString() == req.params.id) == true) {
                                                let updateCart = await visionTest.findByIdAndUpdate({ _id: findCart._id, 'instruction._id': req.params.id }, { $pull: { 'instruction': { _id: req.params.id, name: findCart.instruction[i].name, image: findCart.instruction[i].image, } } }, { new: true })
                                                if (updateCart) {
                                                        return res.status(200).send({ message: "User delete from Vision test.", data: updateCart, });
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
exports.addQuestionInVisionTest = async (req, res) => {
        try {
                const { question, options, answer } = req.body;

                if (req.file) {
                        req.body.image = req.file.path;
                } else {
                        return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                }
                let data = {
                        question: question,
                        options: options,
                        answer: answer,
                        image: req.body.image,
                        visionTestId: req.params.visionTestId,
                }
                const newCategory = await visionTestQuestion.create(data);
                return res.status(200).json({ status: 200, message: 'Vision test update successfully', data: newCategory });

        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Vision test' });
        }
};
exports.getVisionTestQuestionById = async (req, res) => {
        try {
                const findBanner = await visionTestQuestion.findById(req.params.id);
                if (findBanner) {
                        return res.status(200).json({ status: 200, message: 'Vision test found successfully', data: findBanner });
                } else {
                        return res.status(404).json({ message: "Vision test not found.", status: 200, data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Vision test' });
        }
};
exports.updateQuestionInVisionTest = async (req, res) => {
        try {
                const { id } = req.params;
                const findBanner = await visionTestQuestion.findById(id);
                if (!findBanner) {
                        return res.status(404).json({ message: "Vision test Not Found", status: 404, data: {} });
                }
                if (req.file) {
                        findBanner.image = req.file.path
                } else {
                        findBanner.image = findBanner.image;
                }
                findBanner.question = req.body.question;
                findBanner.options = req.body.options;
                findBanner.answer = req.body.answer;
                let update = await findBanner.save();
                return res.status(200).json({ message: "Updated Successfully", status: 200, data: update });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Vision test' });
        }
};
exports.getQuestionInVisionTest = async (req, res) => {
        try {
                const findBanner = await visionTestQuestion.find({ visionTestId: req.params.visionTestId });
                if (findBanner.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Vision test found successfully', data: findBanner });
                } else {
                        return res.status(404).json({ message: "Vision test not found.", status: 200, data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Vision test' });
        }
};
exports.removeQuestionInVisionTest = async (req, res) => {
        try {
                const { id } = req.params;
                const findBanner = await visionTestQuestion.findById(id);
                if (!findBanner) {
                        return res.status(404).json({ message: "Vision test Not Found", status: 404, data: {} });
                } else {
                        await visionTestQuestion.findByIdAndDelete(findBanner._id);
                        return res.status(200).json({ message: "Vision test Deleted Successfully !" });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Vision test' });
        }
};
exports.getAllSubscription = async (req, res) => {
        try {
                const findSubscription = await Subscription.find();
                if (findSubscription.length == 0) {
                        return res.status(404).send({ status: 404, message: "Subscription Not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Subscription found successfully.", data: findSubscription });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, error: "Internal Server Error" });
        }
};
exports.createSubscription = async (req, res) => {
        try {
                let findSubscription = await Subscription.findOne({ plan: req.body.plan });
                if (findSubscription) {
                        return res.status(409).send({ status: 409, message: "Subscription Already exit", data: {} });
                } else {
                        const newCategory = await Subscription.create(req.body);
                        return res.status(200).send({ status: 200, message: "Subscription Create successfully.", data: newCategory });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, error: "Internal Server Error" });
        }
};
exports.getSubscriptionById = async (req, res) => {
        try {
                const findSubscription = await Subscription.findById(req.params.id);
                if (!findSubscription) {
                        return res.status(404).send({ status: 404, message: "Subscription Not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Subscription found successfully.", data: findSubscription });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, error: "Internal Server Error" });
        }
};
exports.updateSubscription = async (req, res) => {
        try {
                const findSubscription = await Subscription.findById(req.params.id);
                if (!findSubscription) {
                        return res.status(404).send({ status: 404, message: "Subscription Not found", data: {} });
                } else {
                        let obj = {
                                plan: req.body.plan || findSubscription.plan,
                                price: req.body.price || findSubscription.price,
                                month: req.body.month || findSubscription.month,
                                discount: req.body.discount || findSubscription.discount,
                                details: req.body.details || findSubscription.details,
                                discription: req.body.discription || findSubscription.discription
                        }
                        const updatedCategory = await Subscription.findByIdAndUpdate(findSubscription._id, obj, { new: true });
                        return res.status(200).send({ status: 200, message: "Subscription found successfully.", data: updatedCategory });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, error: "Internal Server Error" });
        }
};
exports.deleteSubscription = async (req, res) => {
        try {
                const findSubscription = await Subscription.findByIdAndDelete(req.params.id);
                if (!findSubscription) {
                        return res.status(404).send({ status: 404, message: "Subscription Not found", data: {} });
                }
                return res.status(200).send({ status: 200, message: "Subscription deleted successfully.", data: {} });
        } catch (error) {
                return res.status(500).json({ status: 500, error: "Internal Server Error" });
        }
};
exports.createGuide = async (req, res) => {
        try {
                let findGuide = await Guide.findOne({ name: req.body.name });
                if (findGuide) {
                        return res.status(409).json({ message: "Guide already exit.", status: 404, data: {} });
                } else {
                        if (req.files['image']) {
                                let image = req.files['image'];
                                req.body.image = image[0].path;
                        }
                        if (req.files['bannerImage']) {
                                let imagess = req.files['bannerImage'];
                                req.body.bannerImage = imagess[0].path;
                        }
                        const data = { name: req.body.name, image: req.body.image, bannerImage: req.body.bannerImage };
                        const guide = await Guide.create(data);
                        return res.status(200).json({ message: "Guide add successfully.", status: 200, data: guide });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getGuideById = async (req, res) => {
        try {
                const findSubscription = await Guide.findById(req.params.id);
                if (!findSubscription) {
                        return res.status(404).send({ status: 404, message: "Guide Not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Guide found successfully.", data: findSubscription });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, error: "Internal Server Error" });
        }
};
exports.updateGuide = async (req, res) => {
        try {
                const { id } = req.params;
                const guide = await Guide.findById(id);
                if (!guide) {
                        return res.status(404).json({ message: "Guide Not Found", status: 404, data: {} });
                }
                if (req.files['image']) {
                        let image = req.files['image'];
                        req.body.image = image[0].path;
                } else {
                        guide.image = guide.image;
                }
                if (req.files['bannerImage']) {
                        let imagess = req.files['bannerImage'];
                        req.body.bannerImage = imagess[0].path;
                } else {
                        guide.bannerImage = guide.bannerImage;
                }
                guide.name = req.body.name;
                let update = await guide.save();
                return res.status(200).json({ message: "Updated Successfully", status: 200, data: update });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getGuide = async (req, res) => {
        try {
                const guide = await Guide.find({});
                if (guide.length > 0) {
                        return res.status(200).json({ message: "Guide found successfully.", status: 200, data: guide });
                } else {
                        return res.status(404).json({ message: "Guide not found.", status: 200, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.removeGuide = async (req, res) => {
        const { id } = req.params;
        try {
                const guide = await Guide.findById(id);
                if (!guide) {
                        return res.status(404).json({ message: "Guide Not Found", status: 404, data: {} });
                } else {
                        await Guide.findByIdAndDelete(guide._id);
                        return res.status(200).json({ message: "Guide Deleted Successfully !" });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.createQuestionInGuide = async (req, res) => {
        try {
                const { question, answer } = req.body;
                const findSubscription = await Guide.findById({ _id: req.params.guideId });
                if (!findSubscription) {
                        return res.status(404).send({ status: 404, message: "Guide Not found", data: {} });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path;
                        } else {
                                req.body.image = null;
                        }
                        let data = {
                                question: question,
                                answer: answer,
                                image: req.body.image,
                                guideId: req.params.guideId,
                        }
                        const newCategory = await guideQuestion.create(data);
                        return res.status(200).json({ status: 200, message: 'Data add successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Question' });
        }
};
exports.getQuestionInGuide = async (req, res) => {
        try {
                const findSubscription = await guideQuestion.find({ guideId: req.params.guideId });
                if (findSubscription.length == 0) {
                        return res.status(404).send({ status: 404, message: "Question Not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Question found successfully.", data: findSubscription });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, error: "Internal Server Error" });
        }
};
exports.updateQuestionInGuide = async (req, res) => {
        try {
                const { id } = req.params;
                const findSubscription = await guideQuestion.findById(id);
                if (!findSubscription) {
                        return res.status(404).send({ status: 404, message: "Data Not found", data: {} });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path;
                        } else {
                                req.body.image = findSubscription.image;
                        }
                        let obj = {
                                question: req.body.question || findSubscription.question,
                                answer: req.body.answer || findSubscription.answer,
                                image: req.body.image || findSubscription.image,
                        }
                        const updatedCategory = await guideQuestion.findByIdAndUpdate(findSubscription._id, obj, { new: true });
                        return res.status(200).send({ status: 200, message: "Data updated successfully.", data: updatedCategory });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, error: "Internal Server Error" });
        }
};
exports.deleteQuestionInGuide = async (req, res) => {
        try {
                const findSubscription = await guideQuestion.findByIdAndDelete(req.params.id);
                if (!findSubscription) {
                        return res.status(404).send({ status: 404, message: "Data Not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Data deleted successfully.", data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, error: "Internal Server Error" });
        }
};
exports.getQuestionInGuideById = async (req, res) => {
        try {
                const findSubscription = await guideQuestion.findById(req.params.id);
                if (!findSubscription) {
                        return res.status(404).send({ status: 404, message: "Data Not found", data: {} });
                } else {
                        return res.status(200).send({ status: 200, message: "Data found successfully.", data: findSubscription });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, error: "Internal Server Error" });
        }
}
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
                        return res.status(200).json({ status: 200, message: "Offer found.", data: updateOffer });
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
exports.createPowerTypeCategory = async (req, res) => {
        try {
                let findCategory = await powerTypeCategory.findOne({ name: req.body.name, });
                if (findCategory) {
                        return res.status(409).json({ message: "Power Type Category already exit.", status: 404, data: {} });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path
                        } else {
                                return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                        }
                        const data = { name: req.body.name, image: req.body.image, };
                        const category = await powerTypeCategory.create(data);
                        return res.status(200).json({ message: "Power Type Category add successfully.", status: 200, data: category });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getPowerTypeCategories = async (req, res) => {
        try {
                const updateOffer = await powerTypeCategory.find();
                if (updateOffer.length > 0) {
                        return res.status(200).json({ status: 200, message: "Power Type category found.", data: updateOffer });
                } else {
                        return res.status(404).json({ message: "Power Type Category not found.", status: 200, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updatePowerTypeCategory = async (req, res) => {
        try {
                const { id } = req.params;
                const updateOffer = await powerTypeCategory.findById(id);
                if (!updateOffer) {
                        return res.status(404).json({ message: "Power Type Category Not Found", status: 404, data: {} });
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
exports.removePowerTypeCategory = async (req, res) => {
        try {
                const { id } = req.params;
                const updateOffer = await powerTypeCategory.findById(id);
                if (!updateOffer) {
                        return res.status(404).json({ message: "Power Type Category Not Found", status: 404, data: {} });
                } else {
                        await powerTypeCategory.findByIdAndDelete(updateOffer._id);
                        return res.status(200).json({ message: "Power Type Category Deleted Successfully !" });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.createPowerTypeSubcategory = async (req, res) => {
        try {
                let findSubcategory = await powerTypeSubCategory.findOne({ name: req.body.name });
                if (findSubcategory) {
                        return res.status(409).json({ message: "Power Type Subcategory already exit.", status: 404, data: {} });
                } else {
                        const data = { name: req.body.name, categoryId: req.body.categoryId };
                        const subcategory = await powerTypeSubCategory.create(data);
                        return res.status(200).json({ message: "Power Type Subcategory add successfully.", status: 200, data: subcategory });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getPowerTypeSubcategories = async (req, res) => {
        try {
                const updateOffer = await powerTypeSubCategory.find();
                if (updateOffer.length > 0) {
                        return res.status(200).json({ status: 200, message: "Power Type Subcategory found.", Subcategory: updateOffer });
                } else {
                        return res.status(404).json({ message: "Power Type Subcategory not found.", status: 200, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updatePowerTypeSubcategory = async (req, res) => {
        try {
                const { id } = req.params;
                const updateOffer = await powerTypeSubCategory.findById(id);
                if (!updateOffer) {
                        return res.status(404).json({ message: "Power Type Subcategory Not Found", status: 404, data: {} });
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
exports.removePowerTypeSubcategory = async (req, res) => {
        try {
                const { id } = req.params;
                const updateOffer = await powerTypeSubCategory.findById(id);
                if (!updateOffer) {
                        return res.status(404).json({ message: "Power Type Subcategory Not Found", status: 404, data: {} });
                } else {
                        await powerTypeSubCategory.findByIdAndDelete(updateOffer._id);
                        return res.status(200).json({ message: "Power Type Subcategory Deleted Successfully !" });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getPowerTypeSubcategoryByCategory = async (req, res) => {
        try {
                const categoryId = req.params.categoryId;
                const subcategories = await powerTypeSubCategory.find({ categoryId: categoryId });
                if (subcategories.length == 0) {
                        return res.status(404).json({ message: "Power Type Subcategory Not Found", status: 404, data: {} });
                } else {
                        return res.status(200).json({ message: "Power Type Subcategory Data  Successfully !", status: 200, data: subcategories });
                }
        } catch (error) {
                return res.status(500).json({ success: false, error: 'Internal server error' });
        }
};
exports.AddFrame = async (req, res) => {
        try {
                let findShape = await frame.findOne({ name: req.body.name });
                if (findShape) {
                        return res.status(409).json({ message: "frame already exit.", status: 404, data: {} });
                } else {
                        if (req.file) {
                                console.log(req.file);
                                req.body.image = req.file.path
                        } else {
                                return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                        }
                        const data = { name: req.body.name, image: req.body.image };
                        const shape1 = await frame.create(data);
                        return res.status(200).json({ message: "frame add successfully.", status: 200, data: shape1 });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getFrame = async (req, res) => {
        try {
                const findShape = await frame.find({})
                if (findShape.length > 0) {
                        return res.status(200).json({ status: 200, message: "Frame found.", data: findShape });
                } else {
                        return res.status(404).json({ message: "frame not found.", status: 404, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updateFrame = async (req, res) => {
        try {
                const { id } = req.params;
                const findShape = await frame.findById(id);
                if (!findShape) {
                        return res.status(404).json({ message: "frame Not Found", status: 404, data: {} });
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
exports.removeFrame = async (req, res) => {
        try {
                const { id } = req.params;
                const findShape = await frame.findById(id);
                if (!findShape) {
                        return res.status(404).json({ message: "frame Not Found", status: 404, data: {} });
                } else {
                        await frame.findByIdAndDelete(findShape._id);
                        return res.status(200).json({ message: "frame Deleted Successfully !" });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.createLens = async (req, res) => {
        try {
                const { name, powerTypeCategoryId, powerTypeSubCategoryId, frameId, productId, feature, coating, price, topSelling, withInDay } = req.body;
                let findPowerTypeCategory = await powerTypeCategory.findOne({ _id: powerTypeCategoryId });
                if (!findPowerTypeCategory) {
                        return res.status(404).json({ message: "PowerType Category not found.", status: 400, data: {} });
                }
                let findPowerTypeSubCategory = await powerTypeSubCategory.findOne({ _id: powerTypeSubCategoryId });
                if (!findPowerTypeSubCategory) {
                        return res.status(404).json({ message: "PowerType sub Category not found.", status: 400, data: {} });
                }
                let findProduct = await product.findOne({ _id: productId });
                if (!findProduct) {
                        return res.status(404).json({ message: "Product not found.", status: 400, data: {} });
                }
                let findFrame = await frame.findOne({ _id: frameId });
                if (!findFrame) {
                        return res.status(404).json({ message: "Frame not found.", status: 400, data: {} });
                }
                if (req.file) {
                        req.body.logoImage = req.file.path
                }
                let obj = {
                        logoImage: req.body.logoImage,
                        name: name,
                        powerTypeCategoryId: powerTypeCategoryId,
                        powerTypeSubCategoryId: powerTypeSubCategoryId,
                        frameId: frameId,
                        productId: productId,
                        feature: feature,
                        coating: coating,
                        price: price,
                        topSelling: topSelling,
                        withInDay: withInDay
                }
                const subcategory = await lens.create(obj);
                return res.status(200).json({ message: "Lens add successfully.", status: 200, data: subcategory });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
}
exports.getLens = async (req, res) => {
        try {
                const { powerTypeCategoryId, powerTypeSubCategoryId, frameId, productId, topSelling } = req.query;
                const filter = {};
                if (powerTypeCategoryId) {
                        filter.powerTypeCategoryId = powerTypeCategoryId;
                }
                if (powerTypeSubCategoryId) {
                        filter.powerTypeSubCategoryId = powerTypeSubCategoryId;
                }
                if (frameId) {
                        filter.frameId = frameId;
                }
                if (productId) { filter.productId = productId; }
                if (topSelling !== undefined) {
                        filter.topSelling = topSelling === 'true';
                }
                const filteredLens = await lens.find(filter);
                if (filteredLens.length > 0) {
                        return res.status(200).json({ message: "Lens found successfully.", status: 200, data: filteredLens });
                } else {
                        return res.status(404).json({ message: "Lens not found.", status: 404, data: {} });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message });
        }
};
exports.updateLens = async (req, res) => {
        try {
                const { lensId } = req.params;
                const { name, feature, coating, price, topSelling, withInDay } = req.body;
                let powerTypeCategoryId, powerTypeSubCategoryId, frameId, productId;
                let findLens = await lens.findOne({ _id: lensId });
                if (!findLens) {
                        return res.status(404).json({ message: "Lens not found.", status: 404, data: {} });
                }
                if (req.body.powerTypeCategoryId != (null || undefined)) {
                        let findPowerTypeCategory = await powerTypeCategory.findOne({ _id: req.body.powerTypeCategoryId });
                        if (!findPowerTypeCategory) {
                                return res.status(404).json({ message: "PowerType Category not found.", status: 400, data: {} });
                        }
                } else {
                        powerTypeCategoryId = findLens.powerTypeCategoryId
                }
                if (req.body.powerTypeSubCategoryId != (null || undefined)) {
                        let findPowerTypeSubCategory = await powerTypeSubCategory.findOne({ _id: req.body.powerTypeSubCategoryId });
                        if (!findPowerTypeSubCategory) {
                                return res.status(404).json({ message: "PowerType sub Category not found.", status: 400, data: {} });
                        }
                } else {
                        powerTypeSubCategoryId = findLens.powerTypeSubCategoryId
                }
                if (req.body.productId != (null || undefined)) {
                        let findProduct = await product.findOne({ _id: req.body.productId });
                        if (!findProduct) {
                                return res.status(404).json({ message: "Product not found.", status: 400, data: {} });
                        }
                } else {
                        productId = findLens.productId;
                }
                if (req.body.frameId != (null || undefined)) {
                        let findFrame = await frame.findOne({ _id: req.body.frameId });
                        if (!findFrame) {
                                return res.status(404).json({ message: "Frame not found.", status: 400, data: {} });
                        }
                } else {
                        frameId = findLens.frameId
                }
                if (req.file) {
                        req.body.logoImage = req.file.path;
                }
                findLens.logoImage = req.body.logoImage || findLens.logoImage;
                findLens.name = name || findLens.name;
                findLens.powerTypeCategoryId = powerTypeCategoryId;
                findLens.powerTypeSubCategoryId = powerTypeSubCategoryId;
                findLens.frameId = frameId;
                findLens.productId = productId;
                findLens.feature = feature || findLens.feature;
                findLens.coating = coating || findLens.coating;
                findLens.price = price || findLens.price;
                findLens.topSelling = topSelling || findLens.topSelling;
                findLens.withInDay = withInDay || findLens.withInDay;
                const updatedLens = await findLens.save();
                return res.status(200).json({ message: "Lens updated successfully.", status: 200, data: updatedLens });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "Internal server error.", data: error.message });
        }
};
exports.removeLens = async (req, res) => {
        try {
                const { id } = req.params;
                const updateOffer = await lens.findById(id);
                if (!updateOffer) {
                        return res.status(404).json({ message: "Lens Not Found", status: 404, data: {} });
                } else {
                        await lens.findByIdAndDelete(updateOffer._id);
                        return res.status(200).json({ message: "Lens Deleted Successfully !" });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.createAccessories = async (req, res) => {
        try {
                let findAccessories = await product.findOne({ name: req.body.name, type: 'accessories' });
                if (findAccessories) {
                        return res.status(409).json({ message: "Accessories already exit.", status: 404, data: {} });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path
                        } else {
                                return res.status(404).json({ message: "First Chosse an image.", status: 404, data: {} });
                        }
                        const data = { name: req.body.name, price: req.body.price, image: req.body.image, type: 'accessories' };
                        const accessorie = await product.create(data);
                        return res.status(200).json({ message: "Accessories add successfully.", status: 200, data: accessorie });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getAccessories = async (req, res) => {
        try {
                const findShape = await product.find({ type: 'accessories' });
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
                const Accessoriess = await product.findById(id);
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
                const findShape = await product.findById(id);
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
                if (req.body.discountActive == 'true') {
                        req.body.discountPer = req.body.discountPer;
                }
                req.body.type = "product";
                const findProduct = await product.create(req.body);
                return res.status(200).json({ message: "product add successfully.", status: 200, data: findProduct, });
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getProducts = async (req, res) => {
        try {
                const Ads = await product.find({ type: "product" });
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
                const findProduct = await product.findById(req.params.id);
                if (!findProduct) {
                        return next(new ErrorHander("Product not found", 404));
                }
                return res.status(200).json({ status: 200, message: "Product Data found successfully.", data: findProduct })
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.deleteProducts = async (req, res) => {
        try {
                const findProduct = await product.findById({ _id: req.params.id });
                if (!findProduct) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                await product.findByIdAndDelete({ _id: req.params.id });
                return res.status(200).json({ status: 200, message: "Product delete successfully.", data: {} })
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.createBreakageCoverage = async (req, res, next) => {
        try {
                const Ads = await product.findOne({ type: "BreakageCoverage" });
                if (!Ads) {
                        if (req.file) {
                                req.body.image = req.file.path;
                        } else {
                                return res.status(404).json({ message: "Please provide image.", status: 404, data: {}, });
                        }
                        req.body.type = "BreakageCoverage";
                        const findProduct = await product.create(req.body);
                        return res.status(200).json({ message: "Breakage Coverage add successfully.", status: 200, data: findProduct, });
                } else {
                        if (req.file) {
                                Ads.image = req.file.path;
                        } else {
                                Ads.image = Ads.image;
                        }
                        Ads.description = req.body.description || Ads.description;
                        Ads.price = req.body.price || Ads.price;
                        Ads.save();
                        return res.status(200).json({ message: "Breakage Coverage add successfully.", status: 200, data: Ads, });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getBreakageCoverage = async (req, res) => {
        try {
                const Ads = await product.findOne({ type: "BreakageCoverage" });
                if (!Ads) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                } else {
                        return res.status(200).json({ status: 200, message: "Breakage Coverage Data found successfully.", data: Ads })
                }
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.deleteBreakageCoverage = async (req, res) => {
        try {
                const findProduct = await product.findById({ _id: req.params.id });
                if (!findProduct) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                await product.findByIdAndDelete({ _id: req.params.id });
                return res.status(200).json({ status: 200, message: "Breakage Coverage delete successfully.", data: {} })
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.createBottomCard = async (req, res, next) => {
        try {
                const findBottomCard = await bottomCard.findOne({ type: req.body.type });
                if (!findBottomCard) {
                        if (req.file) {
                                req.body.image = req.file.path;
                        } else {
                                return res.status(404).json({ message: "Please provide image.", status: 404, data: {}, });
                        }
                        req.body.type = req.body.type;
                        const findProduct = await bottomCard.create(req.body);
                        return res.status(200).json({ message: "Bottom Card add successfully.", status: 200, data: findProduct, });
                } else {
                        if (req.file) {
                                findBottomCard.image = req.file.path;
                        } else {
                                findBottomCard.image = findBottomCard.image;
                        }
                        findBottomCard.name = req.body.name || findBottomCard.name;
                        findBottomCard.type = req.body.type || findBottomCard.type;
                        findBottomCard.save();
                        return res.status(200).json({ message: "Bottom Card add successfully.", status: 200, data: findBottomCard, });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getBottomCard = async (req, res) => {
        try {
                const Ads = await bottomCard.find({});
                if (Ads.length==0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                } else {
                        return res.status(200).json({ status: 200, message: "Bottom Card Data found successfully.", data: Ads })
                }
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.deleteBottomCard = async (req, res) => {
        try {
                const findProduct = await bottomCard.findById({ _id: req.params.id });
                if (!findProduct) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                await bottomCard.findByIdAndDelete({ _id: req.params.id });
                return res.status(200).json({ status: 200, message: "Bottom Card delete successfully.", data: {} })
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
                const categories = await premiumLenses.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Premium Lenses found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Premium Lenses not found.', data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Premium Lenses' });
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