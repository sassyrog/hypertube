var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const query = require('yify-search');
const mdb = require('moviedb')('5d54c4f8fe9a065d6ed438ef09982650');

router.post('/', (req, response) => {
	console.log(req.body.id);
	
	mdb.movieInfo({ id: req.body.id}, (mdb_err, mdb_res) => {
		query.search(mdb_res.title, (yify_err, yify_res) => {
			if (yify_res.length != 0) {
				for (i = 0; i < yify_res.length; i++) {
					if (yify_res[i].year == mdb_res.release_date.substring(0, 4)) {
						console.log(yify_res[i].id);
				        response.json(yify_res[i].id);
					}
				}
			}
		})
	})
})

module.exports = router;
