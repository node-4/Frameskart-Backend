const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const compression = require("compression");
const serverless = require("serverless-http");
const app = express();
const path = require("path");
app.use(compression({ threshold: 500 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
if (process.env.NODE_ENV == "production") {
        console.log = function () { };
}
app.get("/", (req, res) => {
        res.send("Hello World!");
});

const user = require("./Router/userRoute");
const banner = require("./Router/bannerRoute");
const product = require("./Router/productRoute");
const category = require("./Router/categoryRoute");
const subCategory = require("./Router/subCategoryRoute");
const frame = require("./Router/frameRoute");
const series = require("./Router/seriesRoute");
const brand = require("./Router/brandRoute");
const accessories = require("./Router/accessoriesRoute");
app.use("/api/v1/user", user);
app.use("/api/v1/banner", banner);
app.use("/api/v1/product", product);
app.use("/api/v1/category", category);
app.use("/api/v1/subcategory", subCategory);
app.use("/api/v1/frame", frame);
app.use("/api/v1/series", series);
app.use("/api/v1/brand", brand);
app.use("/api/v1/accessories", accessories);


mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, }).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host} : Shahina-Backend`);
});
app.listen(process.env.PORT, () => {
        console.log(`Listening on port ${process.env.PORT}!`);
});
module.exports = { handler: serverless(app) };
