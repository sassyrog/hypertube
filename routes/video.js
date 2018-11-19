// const router = require('express').Router();
const mdb = require('moviedb')('5d54c4f8fe9a065d6ed438ef09982650');


function getImage(image) {
    mdb.searchMovie({
        query: image
    }, (err, res) => {
        return res.results[1].backdrop_path;
    });
}

module.exports = {
    getImage
};