var express = require('express');
var router = express.Router();
const rp = require('request-promise');
const $ = require('cheerio');
const url = 'http://www.legittorrents.info/index.php?page=torrents&active=1&category=1&order=7&by=1';

const potusParse = function(url) {
  return rp(url)
    .then(function(html) {
      return {
        title: $('.lista', html).text(),
        info_hash: $('.lista', html).text(),
      };
    })
    .catch(function(err) {
      //handle error
    });
};

router.get('/', function(req, res) {

	rp(url)
		.then(function(html) {
			//success!
			console.log($(".lista tr:eq(9)").html);
			// const wikiUrls = [];
			// for (let i = 0; i < 45; i++) {
			// 	wikiUrls.push($('lista > a', html)[i].attribs.href);
			// }
			// return Promise.all(
			// 	wikiUrls.map(function(url) {
			// 		return potusParse('https://en.wikipedia.org' + url);
			// 	})
			// );
			res.send("OK!");
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