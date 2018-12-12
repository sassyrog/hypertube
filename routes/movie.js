var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const mdb = require('moviedb')('5d54c4f8fe9a065d6ed438ef09982650');
var request = require("request");

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

router.post('/default', (req, response) => {
	
	var gg = '';

	mdb.miscPopularMovies({}, (err, res) => {

		// console.log();
		if (req.body.filter == 'title') {
			res.results.sort(dynamicSort(req.body.filter));
		} else {
			res.results.sort(dynamicSort('-' + req.body.filter));
		}

		if (res.results.length != 0) {
			console.log(res.results[0].release_date);
			for (i = 0; i < res.results.length; i++) {
				if (res.results[i].poster_path === null || res.results[i].backdrop_path === null)
					continue;
				gg = gg +
					'<div class="movie-card" onclick="func(this)">\n' +
						'<div class="movie-card-cover">\n' +
							'<div class="movie-header" style="background-image: url(\'https://image.tmdb.org/t/p/w500' + res.results[i].poster_path + '\')">\n' +
								'<div class="header-icon-container">\n' +
									'<div class="movie-title">' + res.results[i].title + 
									'</div>' +
									'<span class="movie-year">(' + res.results[i].release_date.substring(0, 4) + ')</span>' +
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
			if (res.results.length != 0) {
				for (i = 0; i < res.results.length; i++) {
					if (res.results[i].poster_path === null || res.results[i].backdrop_path === null)
						continue;
					yy = yy +
					'<div class="movie-card" onclick="func(this)">\n' +
						'<div class="movie-card-cover">\n' +
							'<div class="movie-header" style="background-image: url(\'https://image.tmdb.org/t/p/w500' + res.results[i].poster_path + '\')">\n' +
								'<div class="header-icon-container">\n' +
									'<div class="movie-title">' + res.results[i].title + 
									'</div>' +
									'<span class="movie-year">(' + res.results[i].release_date.substring(0, 4) + ')</span>' +
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