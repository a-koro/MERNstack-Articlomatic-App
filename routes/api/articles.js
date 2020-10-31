const express = require('express');
const router = express.Router();

router.get(
    '/getArticles', async (req, res) => {
        res.send("hello alex");
    }
);

module.exports = router;