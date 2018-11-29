const express = require('express');
const fs = require('fs');
var torrentStream = require('torrent-stream');
const path = require('path');
const app = express();

app.get('/', function(req, res) {
	const path = 'assets/mlky_6.mp4'
	const stat = fs.statSync(path)
	const fileSize = stat.size
	const range = req.headers.range
	if (range) {
		const parts = range.replace(/bytes=/, "").split("-")
		const start = parseInt(parts[0], 10)
		const end = parts[1] ?
			parseInt(parts[1], 10) :
			fileSize - 1
		const chunksize = (end - start) + 1
		const file = fs.createReadStream(path, {
			start,
			end
		})
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4'
		}
		res.writeHead(206, head)
		file.pipe(res)
	} else {
		res.render('video');
	}
})

module.exports = app;