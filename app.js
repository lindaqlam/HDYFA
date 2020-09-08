var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

const mongoose = require('mongoose');
mongoose
	.connect('mongodb://localhost:27017/hdyfa', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Connected to DB!'))
	.catch((error) => console.log(error.message));

//SCHEMA
var hotTopicSchema = new mongoose.Schema({
	title: String,
	image: String,
	description: String
});

var HotTopic = mongoose.model('HotTopic', hotTopicSchema);

// HotTopic.create(
// 	{
// 		title: 'WAP Public Outry',
// 		image: 'https://upload.wikimedia.org/wikipedia/en/f/f4/Cardi_B_-_WAP_%28feat._Megan_Thee_Stallion%29.png',
// 		description: 'Anyone who thinks this song is anti-feminist is a fool.'
// 	},
// 	function(err, hot_topic) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			console.log('Newly created hot topic!');
// 			console.log(hot_topic);
// 		}
// 	}
// );

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var hot_topics = [
	{
		title: 'Folklore, The Album',
		image:
			'https://ca-times.brightspotcdn.com/dims4/default/22c8d63/2147483647/strip/true/crop/3448x3448+0+0/resize/840x840!/quality/90/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F94%2Fd3%2Fac50aa2e4574bbd76d2b8ce47d91%2Fla-photos-handouts-la-et-exclusive-taylor-swift-folklore-album-102.JPG'
	},
	{
		title: 'Adult Disney Fanatics',
		image:
			'https://images.unsplash.com/photo-1535764558463-30f3af596bee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80'
	},
	{
		title: 'AOC',
		image: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Alexandria_Ocasio-Cortez_Official_Portrait.jpg'
	},
	{
		title: "Trader Joe's",
		image:
			'https://a57.foxnews.com/static.foxbusiness.com/foxbusiness.com/content/uploads/2020/07/0/0/trader-joes-Getty.png?ve=1&tl=1'
	},
	{
		title: 'Folklore, The Album',
		image:
			'https://ca-times.brightspotcdn.com/dims4/default/22c8d63/2147483647/strip/true/crop/3448x3448+0+0/resize/840x840!/quality/90/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F94%2Fd3%2Fac50aa2e4574bbd76d2b8ce47d91%2Fla-photos-handouts-la-et-exclusive-taylor-swift-folklore-album-102.JPG'
	},
	{
		title: 'Adult Disney Fanatics',
		image:
			'https://images.unsplash.com/photo-1535764558463-30f3af596bee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80'
	},
	{
		title: 'AOC',
		image: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Alexandria_Ocasio-Cortez_Official_Portrait.jpg'
	},
	{
		title: "Trader Joe's",
		image:
			'https://a57.foxnews.com/static.foxbusiness.com/foxbusiness.com/content/uploads/2020/07/0/0/trader-joes-Getty.png?ve=1&tl=1'
	},
	{
		title: 'Folklore, The Album',
		image:
			'https://ca-times.brightspotcdn.com/dims4/default/22c8d63/2147483647/strip/true/crop/3448x3448+0+0/resize/840x840!/quality/90/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F94%2Fd3%2Fac50aa2e4574bbd76d2b8ce47d91%2Fla-photos-handouts-la-et-exclusive-taylor-swift-folklore-album-102.JPG'
	},
	{
		title: 'Adult Disney Fanatics',
		image:
			'https://images.unsplash.com/photo-1535764558463-30f3af596bee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80'
	},
	{
		title: 'AOC',
		image: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Alexandria_Ocasio-Cortez_Official_Portrait.jpg'
	},
	{
		title: "Trader Joe's",
		image:
			'https://a57.foxnews.com/static.foxbusiness.com/foxbusiness.com/content/uploads/2020/07/0/0/trader-joes-Getty.png?ve=1&tl=1'
	}
];

app.get('/', function(req, res) {
	res.render('landing');
});

//INDEX - show all hot topics
app.get('/hot_topics', function(req, res) {
	HotTopic.find({}, function(err, all_topics) {
		if (err) {
			console.log(err);
		} else {
			res.render('index', { hot_topics: all_topics });
		}
	});
});

//CREATE - add new hot topic
app.post('/hot_topics', function(req, res) {
	var title = req.body.title;
	var image = req.body.image;
	var desc = req.body.description;
	var new_topic = { title: title, image: image, description: desc };

	HotTopic.create(new_topic, function(err, newlyCreated) {
		if (err) {
		} else {
			res.redirect('/hot_topics');
		}
	});
});

//NEW - show form to create new hot topic
app.get('/hot_topics/new', function(req, res) {
	res.render('new');
});

//SHOW - shows info about one hot topic
app.get('/hot_topics/:id', function(req, res) {
	HotTopic.findById(req.params.id, function(err, foundTopic) {
		if (err) {
			console.log(err);
		} else {
			res.render('show', { hot_topic: foundTopic });
		}
	});
});

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log('HDYFA server has started!');
});
