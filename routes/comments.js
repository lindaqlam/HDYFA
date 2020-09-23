var express = require('express');
var router = express.Router({ mergeParams: true });
var HotTopic = require('../models/hot_topic');
var User = require('../models/user');
var Comment = require('../models/comment');
var Report = require('../models/report');
var middleware = require('../middleware');

// COMMENTS NEW
router.get('/new', middleware.isLoggedIn, function(req, res) {
	HotTopic.findById(req.params.id, function(err, hot_topic) {
		if (err) {
			req.flash('error', "You don't have permission");
			res.redirect('/hot_topics/' + req.params.id);
		} else {
			res.render('comments/new', { hot_topic: hot_topic });
		}
	});
});

// COMMENTS CREATE
router.post('/', middleware.isLoggedIn, function(req, res) {
	HotTopic.findById(req.params.id, function(err, hot_topic) {
		if (err || !hot_topic) {
			req.flash('error', 'Your comment could not be posted.');
			res.redirect('/hot_topics');
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					req.flash('error', 'Comment could not be posted');
					res.redirect('back');
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.hot_topic = hot_topic;
					comment.save();
					hot_topic.comments.push(comment);
					hot_topic.save();

					User.findOne({ username: comment.author.username }, function(err, foundUser) {
						if (err) {
							req.flash('error', 'Comment could not be posted');
							res.redirect('back');
						} else {
							foundUser.comments.push(comment);
							foundUser.save();

							req.flash('success', 'Successfully posted your comment!');
							res.redirect('/hot_topics/' + hot_topic._id);
						}
					});
				}
			});
		}
	});
});

//COMMENT EDIT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentAuthorization, function(req, res) {
	HotTopic.findById(req.params.id, function(err, foundTopic) {
		if (err || !foundTopic) {
			req.flash('error', 'Hot Topic not found');
			return res.redirect('back');
		}

		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err || !foundComment) {
				req.flash('error', 'Comment not found');
				res.redirect('back');
			} else {
				res.render('comments/edit', { hot_topic_id: req.params.id, comment: foundComment });
			}
		});
	});
});

// COMMENT UPDATE ROUTE
router.put('/:comment_id', middleware.checkCommentAuthorization, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err || !updatedComment) {
			req.flash('error', 'Your comment could not be edited.');
			res.redirect('back');
		} else {
			updatedComment.edited = true;
			updatedComment.save();
			req.flash('success', 'Successfully edited your comment!');
			res.redirect('/hot_topics/' + req.params.id);
		}
	});
});

// COMMENT DELETE ROUTE
router.delete('/:comment_id', middleware.checkCommentAuthorization, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment) {
		if (err || !foundComment) {
			req.flash('error', 'Your comment could not be deleted.');
			return res.redirect('back');
		} else {
			req.flash('success', 'Successfully deleted your comment');
			res.redirect('/hot_topics/' + req.params.id);
		}
	});
});

// COMMENT REPORT ROUTES
router.get('/:comment_id/report', middleware.isLoggedIn, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			req.flash('error', 'An error has occued. Please try again.');
			return res.redirect('back');
		} else {
			res.render('comments/report', { comment: foundComment });
		}
	});
});

router.post('/:comment_id/report', middleware.isLoggedIn, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err || !foundComment) {
			req.flash('error', 'An error has occued. Please try again.');
			return res.redirect('back');
		} else {
			Report.create({ reason: req.body.report_reason }, function(err, report) {
				if (err) {
					req.flash('error', 'An error has occued. Please try again.');
					return res.redirect('back');
				} else {
					report.author.id = req.user._id;
					report.author.username = req.user.username;
					report.comment = foundComment;
					report.save();
					req.flash('success', 'This Hot Take is now under review. We will respond shortly.');
					res.redirect('/hot_topics/' + foundComment.hot_topic._id);
				}
			});
		}
	});
});

module.exports = router;
