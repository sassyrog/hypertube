var express = require('express');
var router = express.Router();
var flash = require('connect-flash');

let User = require('../models/user');

router.post('/', (req, res) => {

    var gg = '';

    User.find({}, (err, users) => {
        for (var i = 0; i < users.length; i++) {
            gg = gg +
                '<div class="pic">' +
                '<img src="' + users[i].profile_img + '" width="150" height="150" alt="">' +
                '<div class="card hover-profile-card" style="width: 12rem;">' +
                '<img class="card-img-top" src="' + users[i].profile_img + '" alt="Card image cap">' +
                '<hr>' +
                '<div class="card-body text-center">' +
                '<a href="#"><h5 class="card-title">' + users[i].firstname + ' ' + users[i].lastname + '</h5></a>' +
                '<p class="card-text"></p>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
        res.send(gg);
    })
})

module.exports = router;