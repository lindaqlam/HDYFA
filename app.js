var express = require('express');
var app = express();
var bodyParser = require('body-parser'); //parse information from forms
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var flash = require('connect-flash');

var HotTopic = require('./models/hot_topic');
var Comment = require('./models/comment');
var User = require('./models/user');

var commentRoutes = require('./routes/comments');
var topicRoutes = require('./routes/hot_topics');
var indexRoutes = require('./routes/index');

mongoose
	.connect('mongodb://localhost:27017/hdyfa', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => console.log('Connected to DB!'))
	.catch((error) => console.log(error.message));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

app.use(
	require('express-session')({
		secret: 'I love dogs, especially coco',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use(indexRoutes);
app.use('/hot_topics/:id/comments', commentRoutes);
app.use('/hot_topics', topicRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log('HDYFA server has started!');
});
