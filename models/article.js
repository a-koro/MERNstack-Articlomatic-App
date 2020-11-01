const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category"
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: "Author"
    }
});

module.exports = mongoose.model('article', articleSchema);