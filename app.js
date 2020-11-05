const express = require('express');
const app = express();
const connectDB = require('./config/db');
require('dotenv').config();
const Article = require('./models/article');
const author = require('./models/author');
const Category = require('./models/category');

app.use('/api', require('./routes/api/articles'));
app.use('/api', require('./routes/api/categories'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

connectDB();

app.listen(process.env.PORT, () => console.log('server running on ' + process.env.PORT));