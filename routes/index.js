var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var middleware = require('../middleware');

// ROOT ROUTE
router.get('/', function(req, res) {
	res.render('landing');
});

// REGISTER FORM
router.get('/register', function(req, res) {
	if (req.isAuthenticated()) {
		req.flash('error', "You're already logged in.");
		res.redirect('/hot_topics');
	} else {
		res.render('register');
	}
});

// REGISTER POST
router.post('/register', function(req, res) {
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var birthday = req.body.birthday;
	var gender = req.body.gender;
	var email = req.body.email;
	var username = req.body.username;
	var bio = req.body.bio;
	var photo = req.body.photo;

	var newUser = new User({
		first_name: first_name,
		last_name: last_name,
		birthday: birthday,
		gender: gender,
		email: email,
		username: username,
		bio: bio,
		photo: photo
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
	if (req.isAuthenticated()) {
		req.flash('error', "You're already logged in.");
		res.redirect('/hot_topics');
	} else {
		res.render('login');
	}
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
				res.redirect('/hot_topics');
			} else {
				res.render('../views/profile', { user: foundUser });
			}
		});
});

router.get('/user/edit/:username', middleware.checkAccountAuthorization, function(req, res) {
	User.findOne({ username: req.params.username }, function(err, foundUser) {
		if (err || !foundUser) {
			req.flash('error', 'User not found');
			res.redirect('/hot_topics');
		} else {
			res.render('edit', { user: foundUser });
		}
	});
});

router.put('/user/edit_profile/:username', middleware.checkAccountAuthorization, function(req, res) {
	var updatedInfo = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		birthday: req.body.birthday,
		gender: req.body.gender,
		email: req.body.email,
		bio: req.body.bio,
		photo: req.body.photo
	};

	var options = {
		new: true
	};

	User.findOneAndUpdate({ username: req.params.username }, updatedInfo, options, function(err, updatedUser) {
		if (err || !updatedUser) {
			req.flash('error', 'Your profile could not be edited.');
			res.render('back');
		} else {
			req.flash('success', 'Successfully edited your profile!');
			res.redirect('/user/' + req.params.username);
		}
	});
});

router.put('/user/edit_password/:username', middleware.checkAccountAuthorization, function(req, res) {
	if (req.body.new_password !== req.body.confirm_password) {
		req.flash('error', "Passwords don't match.");
		res.redirect('/user/edit/' + req.params.username);
	} else {
		User.findOne({ username: req.params.username }, function(err, foundUser) {
			if (err || !foundUser) {
				req.flash('error', 'An error has occured. Please try again.');
				res.redirect('back');
			} else {
				foundUser.changePassword(req.body.password, req.body.new_password, function(err) {
					if (err) {
						req.flash('error', 'Password is incorrect.');
						res.redirect('/user/edit/' + req.params.username);
					} else {
						req.flash('success', 'Successfully changed your password!');
						res.redirect('/user/' + req.params.username);
					}
				});
			}
		});
	}
});

router.get('/reset_password', function(req, res) {
	res.render('reset_password');
});

router.get('/about', function(req, res) {
	res.render('about');
});

router.get('/bookmarks', middleware.isLoggedIn, function(req, res) {
	User.findById(req.user._id).populate('bookmarks').exec(function(err, foundUser) {
		if (err || !foundUser) {
			console.log(err);
		} else {
			res.render('bookmarks', { user: foundUser });
		}
	});
});

module.exports = router;
