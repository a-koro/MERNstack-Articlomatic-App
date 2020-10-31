const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    id: Number,
    title: String,
    content: String
});

module.exports = mongoose.model('article', articleSchema);