const mongoose = require('mongoose');

const articleImageSchema = new mongoose.Schema({
    name: String,
    contentLength: Number,
    img: { 
        data: Buffer, 
        contentType: String 
    },
    article: {
        type: mongoose.Types.ObjectId,
        ref: "Article"
    }
});

module.exports = mongoose.model('ArticleImage', articleImageSchema);