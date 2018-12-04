const express = require('express');
const fs = require('fs');
var torrentStream = require('torrent-stream');
const path = require('path');
const app = express();
const query = require('yify-search');

// var engine = torrentStream('magnet:?xt=urn:btih:F4D8C0D87F540431A1035E7C8E52D91A756B95B9&dn=A%20Madea%20Christmas%20(2013)&tr=udp://open.demonii.com:1337&tr=udp://tracker.istole.it:80&tr=http://tracker.yify-torrents.com/announce&tr=udp://tracker.publicbt.com:80&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://exodus.desync.com:6969&tr=http://exodus.desync.com:6969/announce');
var movieID;

// query.search('big hero 6', (error, result) => {
//     console.log(result);
// })

app.get('/:id', function(req, res) {
    // const path = 'assets/sintel-trailer.m4v'
    // const stat = fs.statSync(path)
	const range = req.headers.range
	movieID = req.params.id
	console.log("movie ID = " + movieID);
	if (movieID) {
		mdb.movieInfo({ id: movieID}, (mdb_err, mdb_res) => {
			// console.log(mdb_res);
			query.search(mdb_res.title, (yify_err, yify_res) => {
				console.log(yify_res);
				// if (yify_res.length != 0) {
				// 	for (i = 0; i < yify_res.length; i++) {
				// 		if (yify_res[i].year == mdb_res.release_date.substring(0, 4)) {
				// 			console.log(yify_res[i].magnet);
				// 			engine = torrentStream(yify_res[i].magnet);
				// 		}
				// 	}
				// } else {
				// 	console.log("No video");
				// }
			})
		});
	}
	
	
	
	if (range) {
		const parts = range.replace(/bytes=/, "").split("-")
		// if (parts[0] == 0) {
			// var engine = torrentStream('magnet:?xt=urn:btih:966D30A8BBC61A1FB50842CAB6983B17ECA2CF9A&dn=Big%20Hero%206%20(2014)&tr=udp://open.demonii.com:1337&tr=udp://tracker.istole.it:80&tr=http://tracker.yify-torrents.com/announce&tr=udp://tracker.publicbt.com:80&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://exodus.desync.com:6969&tr=http://exodus.desync.com:6969/announce');
		// }
		engine.on('ready', function() {
			engine.files.forEach(function(file) {
				if (file.name.match(/mp4$/)) {
					const fileSize = file.length
					// console.log("-------->  "+range+" <----------")
					
					// const parts = range.replace(/bytes=/, "").split("-")
					const start = parseInt(parts[0], 10)
					// if (parts[1]) {
					// 	end = parts[1]
					// } else {
						// end = (start + 10000) > fileSize ? fileSize - 1 : start + 10000
					// }
					const end = parts[1] ?
						parseInt(parts[1], 10) :
						fileSize - 1
					const chunksize = (end - start) + 1
					var stream
					// var request = new Promise(function(resolve, reject) {
						stream = file.createReadStream({
								start,
								end
							});
					// })
					// request.then(function successHandler(result) {
						const head = {
							// 'Content-Range': `bytes ${start}-${end}`,
							'Content-Range': `bytes ${start}-${end}/${fileSize}`,
							'Accept-Ranges': 'bytes',
							'Content-Length': chunksize,
							'Content-Type': 'video/mp4'
						}
						res.writeHead(206, head)
						stream.pipe(res)
					// }, function failureHandler(error) {
					// 	console.log("FUCK YOU BITCH ASS NIGGA")
					// });
				}
			});
		});
	} else {
		res.render('video')
	}
	
	// console.log("-------->  "+range+" <----------")
    // if (range) {
        // const parts = range.replace(/bytes=/, "").split("-")
		// const start = parseInt(parts[0], 10)
        // const end = parts[1] ?
        //     parseInt(parts[1], 10) :
		// 	fileSize - 1
		// var test = (start + 10000) > fileSize ? fileSize - 1 : start + 10000;
        // const chunksize = (test - start) + 1
        // const chunksize = (end - start) + 1
        // const file = fs.createReadStream(path, {
        //     start,
        //     test
        // })
        // const head = {
        //     'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        //     'Accept-Ranges': 'bytes',
        //     'Content-Length': chunksize,
        //     'Content-Type': 'video/mp4'
        // }
        // res.writeHead(206, head)
        // file.pipe(res)
//     } else {
//         res.render('video');
//     }
// })
});
module.exports = app;

