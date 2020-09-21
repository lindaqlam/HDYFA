var HotTopic = require('../models/hot_topic');
var Comment = require('../models/comment');
var User = require('../models/user');

var middlewareObject = {};

middlewareObject.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'You must be logged in to perform this action.');
	res.redirect('/login');
};

middlewareObject.checkTopicAuthorization = function(req, res, next) {
	if (req.isAuthenticated()) {
		HotTopic.findById(req.params.id, function(err, foundTopic) {
			if (err || !foundTopic) {
				req.flash('error', 'Hot Topic not found');
				res.redirect('back');
			} else {
				if (foundTopic.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', "You don't have permission");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', "You don't have permission to edit this hot topic.");
		res.redirect('back');
	}
};

middlewareObject.checkCommentAuthorization = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err || !foundComment) {
				req.flash('error', 'Comment not found');
				res.redirect('back');
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', "You don't have permission");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', "You don't have permission to edit this comment.");
		res.redirect('back');
	}
};

middlewareObject.checkAccountAuthorization = function(req, res, next) {
	if (req.isAuthenticated()) {
		User.findOne({ username: req.params.username }, function(err, foundUser) {
			if (err || !foundUser) {
				console.log(err);
			} else {
				if (foundUser._id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', "You don't have permission to edit this profile.");
					res.redirect('/hot_topics');
				}
			}
		});
	} else {
		req.flash('error', "You don't have permission to edit this profile.");
		res.redirect('/login');
	}
};

module.exports = middlewareObject;
