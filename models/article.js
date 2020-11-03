const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxlength: [60, 'Title too long']
    },
    content: String,
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category"
    },
    // author: {
    //     type: mongoose.Types.ObjectId,
    //     ref: "Author"
    // }
    authorFirstName: String,
    authorLastName: String
});

module.exports = mongoose.model('article', articleSchema);