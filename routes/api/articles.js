const express = require('express');
const router = express.Router();
const Article = require('../../models/article');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()

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
    '/addArticle', jsonParser, async (req,res) => {

        let article = new Article({
            title: req.body.title, 
            content: req.body.content, 
            category: req.body.category,
            authorFirstName: req.body.firstname,
            authorLastName: req.body.lastname
        });

        article.save((err) => {
            if(err) {
                console.log(err);
            }
        });

        res.json(article);
});

router.post(
    '/editArticle', jsonParser, async (req,res) => {

    let article = await Article.findById(req.body.id, (err) => {
        if(err) {
            console.log(err);
        }
    });

    res.json(article);

});

router.post(
    '/updateArticle', jsonParser, async (req,res) => {
        let article = await Article.findByIdAndUpdate({_id: req.body.id}, {content: req.body.content}, {
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

router.post(
    '/test', jsonParser, async (req, res) => {
        console.log(req.body);

        res.json({article:"ferfer"});
    }
);

module.exports = router;