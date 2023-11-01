const mongoose = require('mongoose');
const staticContent = mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    meetTheLeader: {
        type: String
    },
    meetLeader: [{
        title: {
            type: String
        },
        degination: {
            type: String
        },
        image: {
            type: String
        },
    }],
    productDescription: {
        type: String
    },
    products: [{
        type: String
    }],
    terms: {
        type: String,
    },
    privacy: {
        type: String,
    },
    type: {
        type: String,
        enum: ["ABOUTUS", "TERMS", "PRIVACY"],
    },
}, {
    timestamps: true
})
module.exports = mongoose.model('staticContent', staticContent);