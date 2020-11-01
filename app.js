const express = require('express');
const app = express();
const connectDB = require('./config/db');
require('dotenv').config();
const Article = require('./models/article');
const author = require('./models/author');
const Category = require('./models/category');

console.log(process.env.NODE_ENV);

app.use('/api', require('./routes/api/articles'));

connectDB();

// const newCategory = new Category({name: "News"});
// newCategory.save((err) => {
//     if(err) {
//         console.log(err);
//     }
//     else {
//         console.log("Added Category");
//     }
// });

// const newAuthor = new author({firstName: "Alexandros", lastName: "Korovesis"});
// newAuthor.save((err) => {
//     if(err) {
//         console.log(err);
//     }
//     else {
//         console.log("Added Category");
//     }
// });

// const newspaper = new Article({
//     title: "second article", 
//     content: "some text",
//     category: newCategory,
//     author: newAuthor
// });

// newspaper.save((err) => {
//     if(err) {
//         console.log(err);
//     }
//     else {
//         console.log("Added Article");
//     }
// });

// Articles.findById('5f9d95b40ac1200ea4b39c4b', (err, articles) => {
//     console.log(articles);
// })

Article.find((err, articles) => {
    console.log(articles);
}).populate(["category", "author"]);

app.listen(4000, () => console.log('server running on 4000'));