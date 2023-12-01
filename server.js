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
app.get("/", (req, res) => {
        res.send("Hello World!");
});


// require('./Router/userRoute')(app);
// require('./Router/admin.route')(app);
require('./RouterNew/admin.route')(app);
require('./RouterNew/userRoute')(app);


mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URI,).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host} : framesKart-Backend`);
});
app.listen(process.env.PORT, () => {
        console.log(`Listening on port ${process.env.PORT}!`);
});
module.exports = { handler: serverless(app) };
