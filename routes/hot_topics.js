var express = require('express');
var router = express.Router();
var HotTopic = require('../models/hot_topic');
var User = require('../models/user');
var Report = require('../models/report');
var middleware = require('../middleware');

//INDEX - show all hot topics
router.get('/', function(req, res) {
	HotTopic.find({}, function(err, all_topics) {
		if (!err) {
			res.render('hot_topics/index', { hot_topics: all_topics });
		}
	});
});

//CREATE - add new hot topic
router.post('/', middleware.isLoggedIn, function(req, res) {
	var title = req.body.title;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var new_topic = {
		title: title,
		image: image,
		description: desc,
		author: author
	};

	HotTopic.create(new_topic, function(err, newHotTopic) {
		if (err) {
			req.flash('error', 'Your hot topic could not be created.');
			res.redirect('/hot_topics');
		} else {
			User.findOne({ username: req.user.username }, function(err, foundUser) {
				if (err) {
					req.flash('error', 'Comment could not be posted');
					res.redirect('back');
				} else {
					foundUser.hot_topics.push(newHotTopic);
					foundUser.save();
					req.flash('success', 'Successfully created a hot topic!');
					res.redirect('/hot_topics');
				}
			});
		}
	});
});

//NEW - show form to create new hot topic
router.get('/new', middleware.isLoggedIn, function(req, res) {
	res.render('hot_topics/new');
});

//SHOW - shows info about one hot topic
router.get('/:id', function(req, res) {
	HotTopic.findById(req.params.id).populate('comments').exec(function(err, foundTopic) {
		/* 
		find HotTopic by id then populating all the comments of that HotTopic,
		.exec - > execute query HotTopic.findById(req.params.id).populate('comments')
		*/
		if (err || !foundTopic) {
			req.flash('error', 'Hot Topic not found');
			res.render('back');
		} else {
			res.render('hot_topics/show', { hot_topic: foundTopic });
		}
	});
});

// EDIT HOT TOPIC ROUTE
router.get('/:id/edit', middleware.checkTopicAuthorization, function(req, res) {
	HotTopic.findById(req.params.id, function(err, foundTopic) {
		res.render('hot_topics/edit', { hot_topic: foundTopic });
	});
});

// UPDATE HOT TOPIC ROUTE
router.put('/:id', middleware.checkTopicAuthorization, function(req, res) {
	HotTopic.findByIdAndUpdate(req.params.id, req.body.hot_topic, function(err, updatedHotTopic) {
		if (err) {
			req.flash('error', 'Your hot topic could not be edited.');
			res.redirect('/hot_topics');
		} else {
			req.flash('success', 'Successfully updated your hot topic!');
			res.redirect('/hot_topics/' + req.params.id);
		}
	});
});

// DESTROY HOT TOPIC ROUTE
router.delete('/:id', middleware.checkTopicAuthorization, function(req, res) {
	HotTopic.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			req.flash('error', 'Your hot topic could not be deleted.');
			res.redirect('/hot_topics');
		} else {
			req.flash('success', 'Successfully deleted your hot topic!');
			res.redirect('/hot_topics');
		}
	});
});

router.get('/:id/report', function(req, res) {
	HotTopic.findById(req.params.id, function(err, foundTopic) {
		if (err || !foundTopic) {
			req.flash('error', 'An error has occued. Please try again.');
			res.redirect('back');
		} else {
			res.render('hot_topics/report', { hot_topic: foundTopic });
		}
	});
});

router.post('/:id/report', middleware.isLoggedIn, function(req, res) {
	HotTopic.findById(req.params.id, function(err, foundTopic) {
		if (err || !foundTopic) {
			req.flash('error', 'An error has occued. Please try again.');
			res.redirect('back');
		} else {
			Report.create({ reason: req.body.report_reason }, function(err, report) {
				if (err) {
					req.flash('error', 'An error has occued. Please try again.');
					res.redirect('back');
				} else {
					report.author.id = req.user._id;
					report.author.username = req.user.username;
					report.hot_topic = foundTopic;
					report.save();

					req.flash('success', 'This Hot Topic is now under review. We will respond shortly.');
					res.redirect('/hot_topics/' + foundTopic._id);
				}
			});
		}
	});
});

module.exports = router;
