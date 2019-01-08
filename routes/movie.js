var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const mdb = require('moviedb')('5d54c4f8fe9a065d6ed438ef09982650');
var request = require("request");

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function(a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

router.post('/default', (req, response) => {

    var gg = '';

    mdb.miscPopularMovies({
        page: req.body.page
    }, (err, res) => {
        var obj = res.results;
        for (i = 0; i < obj.length; i++) {
            obj[i].date = parseInt(obj[i].release_date.replace(/-/g, ''), 10)
        }

        // console.log(obj);

        if (req.body.filter == 'title') {
            obj.sort(dynamicSort(req.body.filter));
        } else {
            obj.sort(dynamicSort('-' + req.body.filter));
        }

        if (obj.length != 0) {
            for (i = 0; i < obj.length; i++) {
                if (obj[i].poster_path === null || obj[i].backdrop_path === null)
                    continue;
                gg = gg +
                    '<div class="movie-card" onclick="func(this)">\n' +
                    '<div class="movie-card-cover">\n' +
                    '<div class="movie-header" style="background-image: url(\'https://image.tmdb.org/t/p/w500' + obj[i].poster_path + '\')">\n' +
                    '<div class="header-icon-container">\n' +
                    '<div class="movie-title">' + obj[i].title +
                    '</div>' +
                    '<span class="movie-year">(' + obj[i].release_date.substring(0, 4) + ')</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
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
            var obj = res.results;
            if (obj.length != 0) {
                for (i = 0; i < obj.length; i++) {
                    if (obj[i].poster_path === null || obj[i].backdrop_path === null)
                        continue;
                    yy = yy +
                        '<div class="movie-card" onclick="func(this)">\n' +
                        '<div class="movie-card-cover">\n' +
                        '<div class="movie-header" style="background-image: url(\'https://image.tmdb.org/t/p/w500' + obj[i].poster_path + '\')">\n' +
                        '<div class="header-icon-container">\n' +
                        '<div class="movie-title">' + obj[i].title +
                        '</div>' +
                        '<span class="movie-year">(' + obj[i].release_date.substring(0, 4) + ')</span>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
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
