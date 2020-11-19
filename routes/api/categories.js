const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const Category = require("../../models/category");
const Article = require('../../models/article');
const auth = require('../../middleware/auth');
const {authAdmin, authUser} = require('../../middleware/authRole');

router.get(
    '/getCategories', async (req,res) => {
        let categories = await Category.find((err, results) => {
            if(err) {
                console.log(err);
            }
        });
        res.json(categories);
    }
);

router.post(
    '/addCategory', auth, authAdmin, async (req,res) => {

        Category.exists({name: req.body.name} , (err, doc) => {
            if (err){ 
                console.log(err) 
            }else{ 
                if(!doc) {
                    let category = new Category({
                        name: req.body.name
                    });

                    category.save((err) => {
                        if(err) {
                            console.log(err);
                        }
                    });
                    res.json({categ:category, exists: doc});
                }
                else {
                    res.json({exists: doc});
                }
            } 
        });
    }
);

router.delete(
    '/deleteCategory', auth, authAdmin, async (req,res) => {
        let articles = await Article.find({category: req.headers.id}, (err, results) => {
            if(err) {
                console.log(err);
            } 
        });
        if(articles.length === 0) {
            let category = await Category.findByIdAndDelete({_id: req.headers.id});
            res.json({safeToDelete: true, category: category});
        } else {
            res.json({safeToDelete: false});
        }
    }
);

module.exports = router;
