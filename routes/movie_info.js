var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const mdb = require('moviedb')('5d54c4f8fe9a065d6ed438ef09982650');
const query = require('yify-search');

router.post('/', (req, response) => {
    mdb.searchMovie({
        query: req.body.title
    }, (err, res) => {
        response.json(res.results[0]);
    });
})

module.exports = router;
