const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    articles: [{
        type: mongoose.Types.ObjectId,
        ref: "Article"
    }]
});

module.exports = mongoose.model("Author", authorSchema);