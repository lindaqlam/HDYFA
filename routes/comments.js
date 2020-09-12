var express = require('express');
var router = express.Router({ mergeParams: true });
var HotTopic = require('../models/hot_topic');
var Comment = require('../models/comment');
var middleware = require('../middleware');

// COMMENTS NEW
router.get('/new', middleware.isLoggedIn, function(req, res) {
	HotTopic.findById(req.params.id, function(err, hot_topic) {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { hot_topic: hot_topic });
		}
	});
});

// COMMENTS CREATE
router.post('/', middleware.isLoggedIn, function(req, res) {
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

//COMMENT EDIT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentAuthorization, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			res.redirect('back');
		} else {
			res.render('comments/edit', { hot_topic_id: req.params.id, comment: foundComment });
		}
	});
});

// COMMENT UPDATE ROUTE
router.put('/:comment_id', middleware.checkCommentAuthorization, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/hot_topics/' + req.params.id);
		}
	});
});

// COMMENT DELETE ROUTE
router.delete('/:comment_id', middleware.checkCommentAuthorization, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/hot_topics/' + req.params.id);
		}
	});
});

module.exports = router;
