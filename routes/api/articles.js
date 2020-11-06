const express = require('express');
const router = express.Router();
const Article = require('../../models/article');

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

        res.json(article);
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

router.post(
    '/updateArticle', async (req,res) => {
        let article = await Article.findByIdAndUpdate({_id: req.headers.id}, {content: req.headers.content}, {
            returnOriginal: false
        });
        res.json(article);
    }
);

router.delete(
    '/deleteArticle', async (req,res) => {
        let article = await Article.findByIdAndDelete({_id: req.headers.id});
        res.json(article);
    }
);

router.get(
    '/getFilteredArticles', async (req,res) => {
        let articles = await Article.find({category: req.query.category}, (err, results) => {
            if(err) {
                console.log(err);
            }
        }).populate(["category"]);
        res.json(articles);
    });

router.get(
    '/searchArticlesByTitle', async (req,res) => {
        let articles = await Article.find({title: new RegExp(req.query.title, "i")}, 'title', (err, results) => {
            if(err) {
                console.log(err);
            }
        });
        res.json(articles);
    }  
);

router.get(
    '/getSpecificArticle', async (req, res) => {
        let article = await Article.find({_id: req.query.id}, (err, results) => {
            if(err) {
                console.log(err);
            }
        }).populate(["category"]);

        res.json(article);
    }
);

module.exports = router;