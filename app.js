const express = require('express');
const app = express();
const connectDB = require('./config/db');
require('dotenv').config();
const Articles = require('./models/article');

console.log(process.env.NODE_ENV);

app.use('/api', require('./routes/api/articles'));

connectDB();

const newspaper = new Articles({id: 1, title: "first article", content: "blablabla"});
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

Articles.find({title: "Daily Mail"}, (err, articles) => {
    console.log("ID: " + articles[0]._id);
});

app.listen(4000, () => console.log('server running on 4000'));