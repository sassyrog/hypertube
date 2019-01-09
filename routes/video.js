const express = require('express');
const fs = require('fs');
var torrentStream = require('torrent-stream');
const path = require('path');
const app = express();
const query = require('yify-search');
const mdb = require('moviedb')('5d54c4f8fe9a065d6ed438ef09982650');
const yifysubtitles = require('yifysubtitles');
var http = require('http');

var chalk = require('chalk');
var flash = require('connect-flash');
let User = require('../models/user');

function loggedIn(req, res, next) {
	if (req.user) {
		next();
	} else {
		res.redirect('/login');
	}
}

app.get('/', loggedIn, function (req, res) {
	var id = req.session.passport.user._id;

	if (req.query.info) {
		var subtitlesArr = []
		var buf = new Buffer.from(req.query.info, 'base64').toString("ascii")
		var param_str = buf.split("&")
		var get_info = {}
		param_str.forEach(function (param) {
			var param_parts = param.split("=")
			get_info[param_parts[0]] = param_parts[1]
		})

		var magnet_promise = new Promise(function (resolve, reject) {
			mdb.movieInfo({
				id: get_info["mdbID"]
			}, (mdb_err, mdb_res) => {
				console.log(mdb_res);
				query.search(mdb_res.title, (yify_err, yify_res) => {
					if (yify_err) throw yify_err
					if (yify_res.length != 0) {
						for (i = 0; i < yify_res.length; i++) {
							if (yify_res[i].year == mdb_res.release_date.substring(0, 4)) {
								var magnet = yify_res[i].magnet;
								var movie_title = yify_res[i].title;
								var movie_link = yify_res[i].large_cover_image;
								yifysubtitles(yify_res[i].imdb_code, {
									path: __dirname + '/../assets/tmp',
									langs: ['sq', 'ar', 'bn', 'bg', 'zh', 'hr', 'cs', 'da', 'nl', 'en', 'et', 'fa', 'fi', 'fr', 'de', 'el', 'he', 'hu', 'id', 'it', 'ja', 'ko', 'lt', 'mk', 'ms', 'no', 'pl', 'pt', 'ro', 'ru', 'sr', 'sl', 'es', 'sv', 'th', 'tr', 'ur', 'uk', 'vi']
								}).then(res => {
									console.log(res);
									res.forEach(function (sub) {
										var subStats = []
										subStats["lang"] = sub.lang;
										subStats["langShort"] = sub.langShort;
										subfile = sub.path.replace(/.+?(?=assets)/g, '');
										subStats["path"] = subfile.substr(6);
										console.log(subStats);
										if (subStats["path"]) {
											subtitlesArr.push(subStats);
										}
									});
									User.findById(id, function (err, user) {
										var movie = {
											title: movie_title,
											poster: movie_link
										};
										if (user.movies.filter(function (e) {
												return e.title === movie_title;
											}).length > 0) {
											return;
										} else {
											user.movies.push(movie);
											user.save((err) => {
												if (err)
													console.log(err);

											})
										}
									})
									resolve(magnet);
									console.log(subtitlesArr);
								});
								var movie_link = yify_res[i].large_cover_image;
								User.findById(id, function (err, user) {
									if (err) throw err
									var movie = {
										title: movie_title,
										poster: movie_link
									};
									if (user.movies.filter(function (e) {
											return e.title === movie_title;
										}).length > 0) {
										return;
									} else {
										user.movies.push(movie);
										user.save((err) => {
											if (err)
												throw err;
										})
									}
								})
							}
						}
					} else {
						resolve("404")
						console.log("No matches on YTS for '" + mdb_res.title + "'");
					}
				})
			});
		});
	}

	const range = req.headers.range
	if (range) {
		const parts = range.replace(/bytes=/, "").split("-")
		var engine = torrentStream(req.session.magnetURI)
		engine.on('ready', function () {



			engine.files.forEach(function (file) {
				if (file.name.match(/mp4$/)) {
					const fileSize = file.length
					const start = parseInt(parts[0], 10)
					const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
					const chunksize = (end - start) + 1
					var stream = file.createReadStream({
						start,
						end
					});
					const head = {
						'Content-Range': `bytes ${start}-${end}/${fileSize}`,
						'Accept-Ranges': 'bytes',
						'Content-Length': chunksize,
						'Content-Type': 'video/mp4'
					}
					res.writeHead(206, head)
					stream.pipe(res)
				}
			});
		});
	} else {
		magnet_promise.then(function (value) {
			if (value == "404") {
				req.flash('error', 'Video Not Found');
				res.redirect('/home') //we need to do something when the YTS doesn't have the movie
			} else {
				req.session.magnetURI = value
				// console.log(value);

				res.render('video', {
					subtitles: subtitlesArr
				})
			}
		});
	}
	// res.render('video')
	// // res.send('sdsd');
});

app.post('/cast', (reqe, response) => {

	var cast = '';

	var options = {
		"method": "GET",
		"hostname": "api.themoviedb.org",
		"port": null,
		"path": "/3/movie/" + reqe.body.id + "/credits?api_key=5d54c4f8fe9a065d6ed438ef09982650",
		"headers": {}
	};

	var req = http.request(options, function (res) {
		var chunks = [];

		res.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res.on("end", function () {
			var body = Buffer.concat(chunks);

			var obj = JSON.parse(body.toString());
			var credits = obj.cast;
			for (var i = credits.length - 1; i >= 0; i--) {
				if (credits[i].profile_path === null) {
					credits.splice(i, 1);
				}
			}
			for (var i = 0; i < credits.length; i++) {
				cast = cast +
					'<div class="cast-member"' +
					'style="background-image:url(\'https://image.tmdb.org/t/p/w500/' +
					credits[i].profile_path + '\')">' +
					'<div class = "cast-name text-center">' + credits[i].name + ' -<br>' +
					credits[i].character + '</div></div>';
			}
			response.send(cast);

		});
	});
	req.end();

})
module.exports = app;