var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// ROOT ROUTE
router.get('/', function(req, res) {
	res.render('landing');
});

// REGISTER FORM
router.get('/register', function(req, res) {
	res.render('register');
});

// REGISTER POST
router.post('/register', function(req, res) {
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var email = req.body.email;
	var username = req.body.username;
	var bio = req.body.bio;

	var newUser = new User({
		first_name: first_name,
		last_name: last_name,
		email: email,
		username: username,
		bio: bio
	});

	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			if (err.message === 'A user with the given username is already registered') {
				req.flash('error', 'A user with that username is already registered');
				return res.redirect('/register');
			} else {
				req.flash('error', 'A user with that email address is already registered');
				return res.redirect('/register');
			}
		}

		passport.authenticate('local')(req, res, function() {
			req.flash('success', 'Welcome to HDYFA ' + user.username + '!');
			res.redirect('/hot_topics');
		});
	});
});

// LOGIN FORM
router.get('/login', function(req, res) {
	res.render('login');
});

// LOGIN LOGIC
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/hot_topics',
		failureRedirect: '/login'
	}),
	function(req, res) {}
);

//LOG OUT
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'Successfully logged out!');
	res.redirect('/hot_topics');
});

// PROFILE ROUTE
router.get('/user/:username', function(req, res) {
	User.findOne({ username: req.params.username })
		.populate({
			path: 'comments',
			populate: {
				path: 'hot_topic'
			}
		})
		.populate('hot_topics')
		.exec(function(err, foundUser) {
			if (err || !foundUser) {
				req.flash('error', 'User not found');
				res.render('back');
			} else {
				res.render('../views/profile', { user: foundUser });
			}
		});
});

router.get('/about', function(req, res) {
	res.render('about');
});

module.exports = router;
