const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    articles: [{
        type: mongoose.Types.ObjectId,
        ref: "Article"
    }]
});

module.exports = mongoose.model("Category", categorySchema);