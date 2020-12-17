const express = require('express');
const router = express.Router();
const Article = require('../../models/article');
const ArticleImage = require('../../models/articleImage');
const auth = require('../../middleware/auth');
const ROLE = require('../../config/roles');
const {authAdmin, authUser} = require('../../middleware/authRole');
var multer  = require('multer');
var upload = multer({storage: multer.memoryStorage()});

router.get(
    '/getArticles', async (req, res) => {
        let articles = await Article.find((err, results) => {
            if(err) {
                console.log(err);
            }
        })
        .sort({createdAt: 'desc'})
        .limit(16)
        .populate("user","firstName lastName")
        .populate(["category"]);

        res.json(articles);
    }
);

router.get(
    '/getTrendingArticles', async (req, res) => {
        let articles = await Article.find((err, results) => {
            if(err) {
                console.log(err);
            }
        })
        .sort({views: 'desc'})
        .limit(5)
        .populate("user","firstName lastName")
        .populate(["category"]);

        res.json(articles);
    }
);

router.post(
    '/myArticles', auth, authUser, async (req,res) => {
        try {
            let articles = await Article
                .find({user: req.user}, "title authorFirstName authorLastName category user")
                .sort({createdAt: 'desc'})
                .populate("user","firstName lastName")
                .populate("category");

            return res.json(articles);
        } catch (err) {
            return res.status(500).json({error: err.message});
        }
    }
);

router.post(
    '/addArticle', auth, authUser, async (req,res) => {

        try {
            let article = new Article({
                title: req.body.title, 
                content: req.body.content,
                category: req.body.category,
                user: req.user
            });
    
            let savedArticle = await article.save();
            
            res.json(savedArticle);
        } catch(err) {
            if(err.errors.title) return res.status(500).json({error: err.errors.title.message});
            if(err.errors.content) return res.status(500).json({error: err.errors.content.message});
            if(err.errors.category) return res.status(500).json({error: err.errors.category.message});
            if(err.errors.user) return res.status(500).json({error: err.errors.user.message});
            return res.status(500);
        }
});

router.post(
    '/editArticle', async (req,res) => {

    let article = await Article.findById(req.body.id, (err) => {
        if(err) {
            console.log(err);
        }
    });

    res.json(article);

});

router.post(
    '/updateArticle', auth, async (req,res) => {
        let articleBeforeUpdate = await Article.findOne({_id: req.body.id});

        if((req.user == articleBeforeUpdate.user) || (req.role === ROLE.ADMIN)) {
            let article = await Article.findByIdAndUpdate({_id: req.body.id}, {content: req.body.content}, {
                returnOriginal: false
            });
            res.json(article);
        } else {
            res.status(401).json({msg: "User unauthorized to modify this article"});
        }
        
    }
);

router.delete(
    '/deleteArticle', auth, async (req,res) => {
        let articleBeforeUpdate = await Article.findOne({_id: req.headers.id});
            
        if((req.user == articleBeforeUpdate.user) || (req.role === ROLE.ADMIN)) {
            let article = await Article.findByIdAndDelete({_id: req.headers.id});
            let articleImage = await ArticleImage.findOneAndDelete({article: req.headers.id});
            res.json(article);
        } else {
            res.status(401).json({msg: "User unauthorized to modify this article"});
        }
    }
);

router.get(
    '/getFilteredArticles', async (req,res) => {
        let articles = await Article.find({category: req.query.category}, 'title', (err, results) => {
            if(err) {
                console.log(err);
            }
        })
        .sort({createdAt: 'desc'})
        .populate("user","firstName lastName").populate(["category"]);
        res.json(articles);
    });

router.post(
        '/getUsersFilteredArticles', auth, async (req,res) => {
            let articles = await Article.find({category: req.query.category, user: req.user}, 'title', (err, results) => {
                if(err) {
                    console.log(err);
                }
            }).populate("user","firstName lastName").populate(["category"]);
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
        await Article.findOneAndUpdate({_id: req.query.id}, { $inc: { views: 1 }});
        let article = await Article.find({_id: req.query.id}, (err, results) => {
            if(err) {
                console.log(err);
            }
        })
        .populate("user","firstName lastName")
        .populate(["category"]);

        res.json(article);
    }
);

// New Endpoint to test multipart/form
router.post(
    '/multipart', upload.single('image'), async (req, res) => {
        console.log(req.file);

        let articleImage = new ArticleImage({
            name: req.file.originalname,
            contentLength: req.file.size,
            img: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });

        let savedImage = await articleImage.save();

        res.writeHead(200, {
            'Content-Type': savedImage.img.contentType,
            'Content-disposition': 'attachment;filename=' + savedImage.name,
            'Content-Length': savedImage.contentLength
        });
        res.end(Buffer.from(savedImage.img.data, 'binary'));
    }
);

// New Endpoint to add Article with image
router.post(
    '/addArticleWithImage', upload.single('image'), auth, authUser, async (req, res) => {
        try {

            let articleImage = new ArticleImage({
                name: req.file.originalname,
                contentLength: req.file.size,
                img: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype
                }
            });
            let savedArticleImage = await articleImage.save();

            let article = new Article({
                title: req.body.title, 
                content: req.body.content,
                category: req.body.category,
                user: req.user,
                image: savedArticleImage
            });
    
            let savedArticle = await article.save();
            let updatedArticleImage = await ArticleImage.findOneAndUpdate({_id: savedArticleImage._id}, {article: savedArticle._id}, {
                returnOriginal: false
            });
    
            res.status(200).end();
        } catch(err) {
            if(err.errors.title) return res.status(500).json({error: err.errors.title.message});
            if(err.errors.content) return res.status(500).json({error: err.errors.content.message});
            if(err.errors.category) return res.status(500).json({error: err.errors.category.message});
            if(err.errors.user) return res.status(500).json({error: err.errors.user.message});
            if(err.errors.contentLength) return res.status(500).json({error: err.errors.contentLength.message});
            if(err.errors.name) return res.status(500).json({error: err.errors.name.message});
            res.status(500).json(err);
        }
    }
);

router.get(
    '/articleImage', async (req,res) => {
        let articleImage = await ArticleImage.findOne({article: req.query.articleId});

        res.writeHead(200, {
            'Content-Type': articleImage.img.contentType,
            'Content-disposition': 'attachment;filename=' + articleImage.name,
            'Content-Length': articleImage.contentLength
        });
        res.end(Buffer.from(articleImage.img.data, 'binary'));
    }
);

module.exports = router;