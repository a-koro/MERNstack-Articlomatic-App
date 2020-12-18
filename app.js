const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();
const Article = require('./models/article');
const author = require('./models/author');
const Category = require('./models/category');

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({extended: true}));

app.use('/api', require('./routes/api/articles'));
app.use('/api', require('./routes/api/categories'));
app.use('/api', require('./routes/api/auth'));

// If in production, then use static frontend build files.
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, './client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, './client/build', 'index.html'));
    });
}

connectDB();

app.listen(process.env.PORT, () => console.log('server running on ' + process.env.PORT));