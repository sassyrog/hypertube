var express = require('express');
var router = express.Router();

let Comment = require('../models/comments');
var mail = require('../config/email.json');

var username = "roger";
var pp  = mail.pp;

router.post('/', (req, res) => {

	let burger = new Buffer(pp, 'base64');

	console.log(req.body);
	var newComment = new Comment({
		user_name: username,
		movie_name: req.body.title,
		year: req.body.year,
		comment: req.body.comment,
		profile_img: pp
	});

	newComment.save().then(item => {
		console.log('jesus!!!');
		res.send("item saved to database");
	  })
	  .catch(err => {
		res.send("unable to save to database");
	  });
})


router.post('/get_comments', (req, res) => {
	var com = '';

	Comment.find({}, function(err, coms) {
		for (let i = coms.length - 1; i >= 0; i--) {
			// console.log(com);
			
			com = com + '<div class="col-sm-8">'
		+ '	<div class="panel panel-white post panel-shadow">'
		+ '		<div class="post-heading">'
		+ '			<div class="pull-left image">'
		+ '				<img src="'+coms[i].profile_img +'" class="img-circle avatar" alt="user profile image">'
		+ '			</div>'
		+ '			<div class="pull-left meta">'
		+ '				<div class="title h5">'
		+ '					<a href="#"><b class="name-b">'+coms[i].user_name+'</b></a>'
		+ '				</div>'
		+ '				<h6 class="text-muted time">'+coms[i].updated.toString().replace(' GMT+0200 (South Africa Standard Time)', '') +'</h6>'
		+ '			</div>'
		+ '		</div>'
		+ '		<div class="post-description">'
		+ '			<p>'+coms[i].comment +'</p>'
		+ '			<div class="stats">'
		+ '				<a href="#" class="btn btn-default stat-item">'
		+ '					<i class="fa fa-thumbs-up icon"></i>2'
		+ '				</a>'
		+ '				<a href="#" class="btn btn-default stat-item">'
		+ '					<i class="fa fa-thumbs-down icon"></i>12'
		+ '				</a>'
		+ '			</div>'
		+ '		</div>'
		+ '	</div>'
		+ '</div>';
		}
		res.send(com);
		
	})
	// console.log(coms);
	
})

module.exports = router;