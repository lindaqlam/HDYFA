var HotTopic = require('../models/hot_topic');
var Comment = require('../models/comment');

var middlewareObject = {};

middlewareObject.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
};

middlewareObject.checkTopicAuthorization = function(req, res, next) {
	if (req.isAuthenticated()) {
		HotTopic.findById(req.params.id, function(err, foundTopic) {
			if (err) {
				res.redirect('back');
			} else {
				if (foundTopic.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect('back');
				}
			}
		});
	} else {
		res.redirect('back');
	}
};

middlewareObject.checkCommentAuthorization = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect('back');
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect('back');
				}
			}
		});
	} else {
		res.redirect('back');
	}
};

module.exports = middlewareObject;
