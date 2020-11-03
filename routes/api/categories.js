const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const Category = require("../../models/category");

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

module.exports = router;
