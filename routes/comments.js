var express = require('express');
var router = express.Router({ mergeParams: true });
var HotTopic = require('../models/hot_topic');
var Comment = require('../models/comment');

// COMMENTS NEW
router.get('/new', isLoggedIn, function(req, res) {
	HotTopic.findById(req.params.id, function(err, hot_topic) {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { hot_topic: hot_topic });
		}
	});
});

// COMMENTS CREATE
router.post('/', isLoggedIn, function(req, res) {
	HotTopic.findById(req.params.id, function(err, hot_topic) {
		if (err) {
			console.log(err);
			res.redirect('/hot_topics');
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					console.log(err);
					console.log('here');
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					hot_topic.comments.push(comment);
					hot_topic.save();
					res.redirect('/hot_topics/' + hot_topic._id);
				}
			});
		}
	});
});

// MIDDLEWARE
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;
