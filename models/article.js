const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [2, 'Title too short'],
        maxlength: [80, 'Title too long']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        minlength: [60, 'Content too short'],
        maxlength: [4000, 'Content too long']
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: [true, 'Category is required']
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, 'User is required']
    }
}, {
    timestamps: true
 });

module.exports = mongoose.model('Article', articleSchema);