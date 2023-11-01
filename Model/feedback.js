const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    feedBack: { type: String },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
},
    { timestamps: true });

module.exports = mongoose.model('feedback', FeedbackSchema);