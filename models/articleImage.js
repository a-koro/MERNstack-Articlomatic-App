const mongoose = require('mongoose');

const articleImageSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: [200, "Image name longer than 200 characters"]
    },
    contentLength: {
        type: Number,
        max: [1000000, "Image larger than 1MB"]
    },
    img: { 
        data: Buffer, 
        contentType: {
            type: String,
            enum: ['image/jpeg', 'image/png'],
            required: true
        }
    },
    article: {
        type: mongoose.Types.ObjectId,
        ref: "Article"
    }
});

module.exports = mongoose.model('ArticleImage', articleImageSchema);