const mongoose = require('mongoose');
// Comment Schema
const commentSchema = mongoose.Schema({
	updated: {
		type: Date,
		default: Date.now 
	},
	user_name: {
		type: String,
		required: true
	},
	movie_name:  {
		type: String,
		required: true
	},
	year: {
		type: Number
	},
	comment:  {
		type: String,
		required: true
	},
	profile_img: {
		type: String
	}
});

const Comment = module.exports = mongoose.model('Comment', commentSchema);