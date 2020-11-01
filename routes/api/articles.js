const express = require('express');
const router = express.Router();
const Article = require('../../models/article');

router.get(
    '/getArticles', async (req, res) => {
        let articles = await Article.find((err, results) => {
            if(err) {
                console.log(err);
            }
        }).populate(["category", "author"]);
        console.log(articles[0]._id.getTimestamp());
        res.json(articles);
    }
);


module.exports = router;