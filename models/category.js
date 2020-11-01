const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    articles: [{
        type: mongoose.Types.ObjectId,
        ref: "Article"
    }]
});

module.exports = mongoose.model("Category", categorySchema);