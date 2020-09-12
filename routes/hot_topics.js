var express = require('express');
var router = express.Router();
var HotTopic = require('../models/hot_topic');

//INDEX - show all hot topics
router.get('/', function(req, res) {
	HotTopic.find({}, function(err, all_topics) {
		if (err) {
			console.log(err);
		} else {
			res.render('hot_topics/index', { hot_topics: all_topics });
		}
	});
});

//CREATE - add new hot topic
router.post('/', isLoggedIn, function(req, res) {
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

	HotTopic.create(new_topic, function(err, newlyCreated) {
		if (err) {
		} else {
			res.redirect('/hot_topics');
		}
	});
});

//NEW - show form to create new hot topic
router.get('/new', isLoggedIn, function(req, res) {
	res.render('hot_topics/new');
});

//SHOW - shows info about one hot topic
router.get('/:id', function(req, res) {
	HotTopic.findById(req.params.id).populate('comments').exec(function(err, foundTopic) {
		/* 
		find HotTopic by id then populating all the comments of that HotTopic,
		.exec - > execute query HotTopic.findById(req.params.id).populate('comments')
		*/
		if (err) {
			console.log(err);
		} else {
			res.render('hot_topics/show', { hot_topic: foundTopic });
		}
	});
});

// EDIT HOT TOPIC ROUTE
router.get('/:id/edit', checkAuthorization, function(req, res) {
	HotTopic.findById(req.params.id, function(err, foundTopic) {
		res.render('hot_topics/edit', { hot_topic: foundTopic });
	});
});

// UPDATE HOT TOPIC ROUTE
router.put('/:id', checkAuthorization, function(req, res) {
	HotTopic.findByIdAndUpdate(req.params.id, req.body.hot_topic, function(err, updatedHotTopic) {
		if (err) {
			res.redirect('/hot_topics');
		} else {
			res.redirect('/hot_topics/' + req.params.id);
		}
	});
});

// DESTROY HOT TOPIC ROUTE
router.delete('/:id', checkAuthorization, function(req, res) {
	HotTopic.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect('/hot_topics');
		} else {
			res.redirect('/hot_topics');
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

function checkAuthorization(req, res, next) {
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
}

module.exports = router;
