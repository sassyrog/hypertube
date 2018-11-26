const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
var torrentStream = require('torrent-stream');
var engine = torrentStream('magnet:?xt=urn:btih:ef330b39f4801d25b4245212e75a38634bfc856e');
 

// engine.on('ready', function() {
// 	engine.files.forEach(function(file) {
// 		console.log('filename:', file.name);
// 		var stream = file.createReadStream();
// 		console.log(stream);
// 		stream.path
// 		// stream is readable stream to containing the file content
// 	});
// });

app.get('/', async function(req, res) {
	const path = 'assets/mlky_6.mp4'
	const stat = fs.statSync(path)
	const fileSize = stat.size
	const range = req.headers.range

	// app.get('/', function(req, res) {
		// console.log("Testing 1 2!!!");
	// });
	if (range) {
		const parts = range.replace(/bytes=/, "").split("-")
		const start = parseInt(parts[0], 10)
		const end = parts[1]
			? parseInt(parts[1], 10)
			: fileSize-1

		const chunksize = (end-start)+1
		const file = fs.createReadStream(path, {start, end})
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
		}
		res.writeHead(206, head)
		res.render('video');
		file.pipe(res)
	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		}
		// res.redirect('video');
		res.writeHead(200, head)
		fs.createReadStream(path).pipe(res)
	}
})

	module.exports = app;