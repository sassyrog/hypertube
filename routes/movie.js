var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const mdb = require('moviedb')('5d54c4f8fe9a065d6ed438ef09982650');

router.post('/default', (req, response) => {
    var gg = '';
    mdb.miscPopularMovies({}, (err, res) => {
        if (res.results.length != 0) {
            for (i = 0; i < res.results.length; i++) {
                if (res.results[i].poster_path === null)
                    continue;
                gg = gg +
                    '<div class="movie-card" onclick="func(this)">\n' +
                    '<div class="movie-header" style="background-image: url(\'https://image.tmdb.org/t/p/w500' + res.results[i].poster_path + '\')">\n' +
                    '<div class="header-icon-container">\n' +
                    '</div>' +
                    '</div>' +
                    '<!--movie-header-->' +
                    '<div class="movie-content">\n' +
                    '<div class="movie-content-header">\n' +
                    '<a href="#">' +
                    '<h3 class="movie-title">' + res.results[i].title + '</h3>' +
                    '</a>' +
                    '<div class="imax-logo"></div>' +
                    '</div>' +
                    '<div class="movie-info">\n' +
                    '<div class="info-section">\n' +
                    '<label>release date</label>' +
                    '<span class="year">' + res.results[i].release_date.substring(0, 4) + '</span>' +
                    '</div>' +
                    '<!--date,time-->' +
                    '<div class="info-section">' +
                    '<label>rating</label>' +
                    '<span>' + res.results[i].vote_average + '</span>' +
                    '</div>' +
                    '<!--screen-->' +
                    '<div class="info-section">\n' +
                    '<label>Row</label>' +
                    '<span>F</span>' +
                    '</div>' +
                    '<!--row-->' +
                    '<div class="info-section">' +
                    '<label>Seat</label>' +
                    '<span>21,22</span>' +
                    '</div>' +
                    '<!--seat-->' +
                    '</div>' +
                    '</div>' +
                    '<!--movie-content-->' +
                    '</div>';
            }
        }
        response.send(gg);
    })
})

router.post('/search', (req, response) => {
    var yy = '';
    if (req.body.search) {
        mdb.searchMovie({
            query: req.body.search
        }, (err, res) => {
            if (res.results.length != 0) {
                for (i = 0; i < res.results.length; i++) {
                    // var pic = res.results[i]._path
                    if (res.results[i].poster_path === null)
                        continue;
                    yy = yy +
                        '<div class="movie-card" onclick="func(this)">\n' +
                        '<div class="movie-header" style="background-image: url(\'https://image.tmdb.org/t/p/w500' + res.results[i].poster_path + '\')">\n' +
                        '<div class="header-icon-container">\n' +
                        '<a href="#">' +
                        '<i class="material-icons header-icon"><span class="fas fa-play"></span></i>' +
                        '</a>' +
                        '</div>' +
                        '</div>' +
                        '<!--movie-header-->' +
                        '<div class="movie-content">\n' +
                        '<div class="movie-content-header">\n' +
                        '<a href="#">' +
                        '<h3 class="movie-title">' + res.results[i].title + '</h3>' +
                        '</a>' +
                        '<div class="imax-logo"></div>' +
                        '</div>' +
                        '<div class="movie-info">\n' +
                        '<div class="info-section">\n' +
                        '<label>release date</label>' +
                        '<span class="year">' + res.results[i].release_date.substring(0, 4) + '</span>' +
                        '</div>' +
                        '<!--date,time-->' +
                        '<div class="info-section">' +
                        '<label>rating</label>' +
                        '<span >' + res.results[i].vote_average + '</span>' +
                        '</div>' +
                        '<!--screen-->' +
                        '<div class="info-section">\n' +
                        '<label>Row</label>' +
                        '<span>F</span>' +
                        '</div>' +
                        '<!--row-->' +
                        '<div class="info-section">' +
                        '<label>Seat</label>' +
                        '<span>21,22</span>' +
                        '</div>' +
                        '<!--seat-->' +
                        '</div>' +
                        '</div>' +
                        '<!--movie-content-->' +
                        '</div>';
                }
            }
            console.log('body: ' + JSON.stringify(req.body));
            response.send(yy);
        })
    } else {
        response.send();
    }
})

module.exports = router;