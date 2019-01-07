var express = require('express');
var router = express.Router();
var session = require('express-session');
const passport = require('passport');

let Comment = require('../models/comments');

router.post('/', (req, res) => {

    // let burger = new Buffer(pp, 'base64');

    console.log(req.body);
    var newComment = new Comment({
        user_name: req.session.passport.user.username,
        movie_name: req.body.title,
        year: req.body.year,
        comment: req.body.comment,
        profile_img: req.session.passport.user.profile_img
    });

    newComment.save().then(item => {
            res.send("item saved to database");
        })
        .catch(err => {
            res.send("unable to save to database");
        });
})


router.post('/get_comments', (req, res) => {
    var com = '';

    Comment.find({
        $and: [{
            movie_name: req.body.title
        }, {
            year: req.body.year
        }]
    }, function(err, coms) {
        for (let i = coms.length - 1; i >= 0; i--) {
            // console.log(com);

            com = com + '<div class="col-sm-8">' +
                '	<div class="panel panel-white post panel-shadow">' +
                '		<div class="post-heading">' +
                '			<div class="pull-left image">' +
                '				<img src="' + coms[i].profile_img + '" class="img-circle avatar" alt="user profile image">' +
                '			</div>' +
                '			<div class="pull-left meta">' +
                '				<div class="title h5">' +
                '					<a href="#"><b class="name-b">' + coms[i].user_name + '</b></a>' +
                '				</div>' +
                '				<h6 class="text-muted time">' + coms[i].updated.toString().replace(' GMT+0200 (South Africa Standard Time)', '') + '</h6>' +
                '			</div>' +
                '		</div>' +
                '		<div class="post-description">' +
                '			<p>' + coms[i].comment + '</p>' +
                '		</div>' +
                '	</div>' +
                '</div>';
        }
        res.send(com);

    })
    // console.log(coms);

})

module.exports = router;