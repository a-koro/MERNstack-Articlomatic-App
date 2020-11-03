const express = require('express');
const router = express.Router();
const Article = require('../../models/article');
const Author = require('../../models/author');

router.get(
    '/getArticles', async (req, res) => {
        let articles = await Article.find((err, results) => {
            if(err) {
                console.log(err);
            }
        }).populate(["category"]);

        res.json(articles);
    }
);

router.post(
    '/addArticle', async (req,res) => {

        // let author = new Author({
        //     firstName: req.headers.firstname,
        //     lastName: req.headers.lastname
        // });

        // author.save((err) => {
        //     if(err) {
        //         console.log(err);
        //     }
        // });

        let article = new Article({
            title: req.headers.title, 
            content: req.headers.content, 
            category: req.headers.category,
            authorFirstName: req.headers.firstname,
            authorLastName: req.headers.lastname
        });

        article.save((err) => {
            if(err) {
                console.log(err);
            }
        });
});

router.post(
    '/editArticle', async (req,res) => {

        let article = await Article.findById(req.headers.id, (err) => {
            if(err) {
                console.log(err);
            }
        });

        res.json(article);

    });

module.exports = router;