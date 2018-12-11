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
			$ = cheerio.load(html);
			cheerioTableparser($);
			data = $("td.lista").eq(1).find('a').attr('href');
			data = "http://www.legittorrents.info/" +  data;
			console.log(data);
			// console.log($('.lista').find('td').length);
			// console.log($(".lista tr").text);
			// const wikiUrls = [];
			// for (let i = 0; i < 45; i++) {
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