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
	var newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			return res.render('register');
		}

		passport.authenticate('local')(req, res, function() {
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
	res.redirect('/hot_topics');
});

// MIDDLEWARE
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;
