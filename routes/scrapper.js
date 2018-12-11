var express = require('express');
var router = express.Router();
const rp = require('request-promise');
var cheerio = require('cheerio'),
		cheerioTableparser = require('cheerio-tableparser'),
		$,
		data;
const url = 'http://www.legittorrents.info/index.php?page=torrents&active=1&category=1&order=7&by=1';

// const potusParse = function(url) {
//   return rp(url)
//     .then(function(html) {
//       return {
//         title: $('.lista', html).text(),
//         info_hash: $('.lista', html).text(),
//       };
//     })
//     .catch(function(err) {
//       //handle error
//     });
// };

router.get('/', function(req, res) {
	rp(url)
		.then(function(html) {
			//success!
			const movie_url = [];
			$ = cheerio.load(html);
			cheerioTableparser($);
			for (let i = 1; i < 71; i += 5) {
				data = $("td.lista").eq(i).find('a').attr('href');
				movie_url.push("http://www.legittorrents.info/" +  data.trim());
			}
			console.log(movie_url);

			"magnet:?xt=urn:btih:f932ee04379cf38901d5c302d5d27735e1f3a4ea&dn=download"
			"magnet:?xt=urn:btih:72c83366e95dd44cc85f26198ecc55f0f4576ad4&dn=The%20Fanimatrix%20Run%20Program%20Full%20Release&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopentor.org%3A2710&tr=udp%3A%2F%2Ftracker.ccc.de%3A80&tr=udp%3A%2F%2Ftracker.blackunicorn.xyz%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969"
													"f932ee04379cf38901d5c302d5d27735e1f3a4ea"
			// data = $("td.lista").eq(1).find('a').attr('href');
			// movie_url.push("http://www.legittorrents.info/" +  data.replace(" ",""));
			// console.log(movie_url);
			// console.log($('.lista').find('td').length);
			// console.log($(".lista tr").text);
			// const wikiUrls = [];
			// for (let i = 1; i < 61; i++) {
			// 	wikiUrls.push($('lista > a', html)[i].attribs.href);
			// }
			// return Promise.all(
			// 	wikiUrls.map(function(url) {
			// 		return potusParse('https://en.wikipedia.org' + url);
			// 	})
			// );
			res.send(html);
		})
		// .then(function(presidents) {
		// 	console.log(presidents);
		// })
		.catch(function(err) {
			//handle error
			console.log(err);
			res.send("Error!!!");
		});
})

 module.exports = router;